import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { join } from "path";
import { BadRequestError, NotFoundError } from "@/server/errors";
import { MediaRepository } from "./media.repo";
import type { TMediaFilter, TMediaType } from "./media.schema";

export class MediaService {
	constructor(private readonly repo: MediaRepository) {}

	private r2 = new S3Client({
		region: "auto",
		endpoint: `https://${process.env.R2_ACCOUNT_ID?.trim()}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: process.env.R2_ACCESS_KEY_ID?.trim() || "",
			secretAccessKey: process.env.R2_SECRET_ACCESS_KEY?.trim() || "",
		},
	});

	async upload(file?: File, type?: TMediaType) {
		if (!file) {
			throw new NotFoundError("File is required");
		}

		const timestamp = Date.now();
		const safeName = file.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase();
		const fileName = `${timestamp}-${safeName}`;
		const key = `seagle/${fileName}`;
		const buffer = await file.arrayBuffer();

		try {
			await this.r2.send(
				new PutObjectCommand({
					Bucket: process.env.R2_BUCKET_NAME!,
					Key: key,
					Body: Buffer.from(buffer),
					ContentType: file.type,
				}),
			);

			const media = await this.repo.create({
				type: type || "others",
				imageKey: key,
				url: `${process.env.R2_PUBLIC_URL}/${key}`,
				fileName: file.name,
				mimeType: file.type,
				size: file.size,
				altText: file.name,
			});
			return media;
		} catch (error) {
			console.error("R2 Upload Error:", error);
			throw new BadRequestError("Failed to upload image to storage.");
		}
	}

	async getAll(filter: TMediaFilter) {
		const { page = 1, limit = 20 } = filter;
		const { items, total } = await this.repo.getAll(filter);

		return {
			message: "Media fetched successfully",
			data: items,
			meta: {
				total,
				page,
				totalPages: Math.ceil(total / limit),
			},
		};
	}

	async delete(id: string) {
		return this.repo.delete(id);
	}
}
