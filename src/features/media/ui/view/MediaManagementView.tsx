"use client";

import { UploadCloud } from "lucide-react";
import { PageLayout } from "@/components/layouts/page-layout";
import { Button } from "@/components/ui/button";
import { MediaGalleryDialog } from "../components/MediaGalleryDialog";
import { MediaLibraryGrid } from "../components/MediaLibraryGrid";

export default function MediaManagementView() {
	return (
		<PageLayout
			title="Media Management"
			subtitle="Upload and manage your store's media files"
		>
			<div className="space-y-6">
				<div className="flex justify-end">
					<MediaGalleryDialog onInsert={() => {}}>
						<Button>
							<UploadCloud className="mr-2 h-4 w-4" />
							Upload New
						</Button>
					</MediaGalleryDialog>
				</div>

				<div className="bg-white p-6 rounded-lg border">
					<MediaLibraryGrid onSelect={() => {}} allowDelete={true} />
				</div>
			</div>
		</PageLayout>
	);
}
