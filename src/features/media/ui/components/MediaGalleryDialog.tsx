"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";
import type { TMediaInput, TMediaType } from "../../domain/media.schema";
import { MediaLibraryGrid } from "./MediaLibraryGrid";

interface MediaGalleryDialogProps {
	type?: TMediaType;
	value?: TMediaInput[];
	onInsert: (items: TMediaInput[]) => void;
	multiple?: boolean;
	children?: React.ReactElement;
}

export function MediaGalleryDialog({
	type,
	onInsert,
	multiple = false,
	children,
	value,
}: MediaGalleryDialogProps) {
	const [open, setOpen] = useState(false);
	const { mutateAsync: upload } = useOrpcMutation(
		orpc.media.create.mutationOptions(),
	);
	const [activeTab, setActiveTab] = useState("library");
	const [selectedMedia, setSelectedMedia] = useState<TMediaInput[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const queryClient = useQueryClient();

	const handleSelect = (item: TMediaInput) => {
		if (multiple) {
			setSelectedMedia((prev) => {
				const isSelected = prev.some((m) => m.id === item.id);
				return isSelected
					? prev.filter((m) => m.id !== item.id)
					: [...prev, item];
			});
		} else {
			setSelectedMedia([item]);
		}
	};

	const handleInsert = () => {
		onInsert(selectedMedia);
		setOpen(false);
		setSelectedMedia([]);
	};

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;

		setIsUploading(true);

		try {
			const uploadedMedia: TMediaInput[] = [];
			for (const file of files) {
				const response = await upload({ file, type });
				uploadedMedia.push({ id: response.data.id, url: response.data.url });
			}

			await queryClient.invalidateQueries({ queryKey: ["media", "getAll"] });
			// Auto-select the newly uploaded files
			if (multiple) {
				setSelectedMedia((prev) => [...prev, ...uploadedMedia]);
			} else {
				setSelectedMedia([uploadedMedia[0]]);
			}
			setActiveTab("library");
		} catch (error) {
			console.error(error);
			toast.error("Failed to upload file(s)");
		} finally {
			setIsUploading(false);
			// reset input
			e.target.value = "";
		}
	};

	useEffect(() => {
		if (open) {
			setSelectedMedia(value || []);
		}
	}, [open, value]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					children || <Button variant="outline">Open Media Library</Button>
				}
			/>
			<DialogContent className="max-w-4xl w-[90vw] h-[80vh] flex flex-col">
				<DialogHeader>
					<DialogTitle>Media Library</DialogTitle>
				</DialogHeader>

				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="flex-1 flex flex-col overflow-hidden"
				>
					<div className="flex justify-between items-center mb-4">
						<TabsList>
							<TabsTrigger value="upload">Upload Files</TabsTrigger>
							<TabsTrigger value="library">Library</TabsTrigger>
						</TabsList>

						<div className="space-x-2">
							<span className="text-sm text-muted-foreground">
								{selectedMedia.length} selected
							</span>
							<Button
								onClick={handleInsert}
								disabled={selectedMedia.length === 0}
							>
								Insert
							</Button>
						</div>
					</div>

					<TabsContent value="upload" className="flex-1 m-0 h-full">
						<div className="h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-12 bg-muted/5">
							<UploadCloud className="size-12 text-muted-foreground mb-4" />
							<h3 className="text-lg font-medium mb-2">
								Drag files here to upload
							</h3>
							<p className="text-muted-foreground mb-4 text-center max-w-sm">
								or click the button below to browse your computer
							</p>

							<div className="relative">
								<Button disabled={isUploading}>
									{isUploading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Uploading...
										</>
									) : (
										"Select Files"
									)}
								</Button>
								<input
									type="file"
									multiple={multiple}
									accept="image/*"
									onChange={handleUpload}
									disabled={isUploading}
									className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
								/>
							</div>
						</div>
					</TabsContent>

					<TabsContent
						value="library"
						className="flex-1 overflow-y-auto m-0 pr-2"
					>
						<MediaLibraryGrid
							type={type}
							selectedUrls={selectedMedia.map((m) => m.url ?? "")}
							onSelect={handleSelect}
						/>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
