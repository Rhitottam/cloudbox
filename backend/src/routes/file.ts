import express, { Request, Response } from 'express';
import { authMiddleware } from './auth';
import { User } from 'better-auth';
import { FileService } from '@/services/file.service';
import { LocalStorageService } from '@/services/storage.service';
import { SqliteChunkRepoistory, SqliteUploadRepository } from '@/repositories/upload.repository';
import { db } from '@/database/setup';
import { SqliteFileRepository } from '@/repositories/file.repository';
import { envConfig } from '@/config';
import { FileMetadataSchema, FileQueryOptionsSchema, UploadCompleteSchema, UploadPartSchema } from '@/validators';
import { getErrorMessage } from '@/lib/utils';

const router = express.Router();

router.use(authMiddleware);

const fileService = new FileService(
  new LocalStorageService(),
  new SqliteUploadRepository(db),
  new SqliteChunkRepoistory(db),
  new SqliteFileRepository(db)
);

router.get('/list', async (req: Request, res: Response) => {
  try {
    const user: User = req.body.user;
    const { id: userId } = user;
    const { limit, offset, sortBy, sortOrder } = req.query;
    const limitValue = limit ? parseInt(String(limit)) : envConfig.RETRIEVAL_LIMIT;
    const offsetValue = offset ? parseInt(String(offset)) : undefined;
    const result = FileQueryOptionsSchema.safeParse({
      limit: limitValue,
      offset: offsetValue,
      sortBy,
      sortOrder,
    });
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid query paramaters'
      })
      return;
    }
    const fileList = await fileService.getFileList(
      userId,
      {
        limit: limitValue + 1,
        offset: offsetValue,
        sortBy: result.data.sortBy,
        sortOrder: result.data.sortOrder,
      },
    );

    res.status(200).json({
      success: true,
      data: {
        list: fileList,
        nextOffset: (offsetValue ?? 0) + limitValue + 1,
        hasMore: fileList && fileList?.length >= limitValue + 1
      }
    })

  } catch (e) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(e),
    });
  }
});

router.post('/upload/initiate', async (req: Request, res: Response) => {
  try {
    const { data, user } = req.body;
    const { id } = user;
    const parsed = FileMetadataSchema.safeParse(data);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid file paramaters'
      })
      return;
    }

    const fileMetadata = parsed.data;

    const uploadInfo = await fileService.initiateUpload(id, fileMetadata);

    res.status(200).json({
      success: true,
      data: uploadInfo,
    });

  } catch (e) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(e),
    });
  }
});

router.post('/upload/part', async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    if (!data) {
      res.status(400).json({
        success: false,
        message: 'Missing data field in request body'
      })
      return;
    }

    const parsed = UploadPartSchema.safeParse(JSON.parse(data));
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: parsed.error ?? 'Invalid upload part parameters'
      })
      return;
    }

    let chunk = req.files?.chunk;
    if (!chunk) {
      res.status(400).json({
        success: false,
        message: 'Uploaded chunk file not found'
      })
      return;
    }

    if (Array.isArray(chunk)) {
      chunk = chunk[0]
    }

    const { uploadId, index } = parsed.data;

    await fileService.uploadPart(uploadId, index, chunk.data);

    res.status(200).json({
      success: true
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(e),
    });
  }
});

router.post('/upload/complete', async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const parsed = UploadCompleteSchema.safeParse(data);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid request parameters'
      })
      return;
    }
    const { uploadId } = parsed.data;

    const fileInfo = await fileService.completeUpload(uploadId);

    res.status(200).json({
      success: true,
      data: fileInfo,
    });

  } catch (e) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(e),
    });
  }
});

router.post('/upload/abort', async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const parsed = UploadCompleteSchema.safeParse(data);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid request parameters'
      })
      return;
    }
    const { uploadId } = parsed.data;

    await fileService.abortUpload(uploadId);

    res.status(200).json({
      success: true,
    });

  } catch (e) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(e),
    });
  }
});

router.get('/download/:fileId', async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const fileMetadata = await fileService.getFileMetadata(fileId);
    if (!fileMetadata || !fileMetadata.url) {
      res.status(404).json({
        success: false,
        message: 'File not found or upload not complete',
      });
      return;
    }

    const fileStream = await fileService.downloadFile(fileId);
    const fileName = fileMetadata.name;
    const fileMimeType = fileMetadata.mimeType;
    res.writeHead(200, {
      'Content-Type': fileMimeType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    fileStream.pipe(res);
    fileStream.on('error', (err) => {
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: getErrorMessage(err, 'Error downloading file'),
        });
      } else {
        res.end();
      }
    });

  } catch (e) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(e),
    });
  }
});

router.get('/view/:fileId', async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const fileMetadata = await fileService.getFileMetadata(fileId);
    if (!fileMetadata || !fileMetadata.url) {
      res.status(404).json({
        success: false,
        message: 'File not found or upload not complete',
      });
      return;
    }

    const fileStream = await fileService.downloadFile(fileId);
    const fileMimeType = fileMetadata.mimeType;
    res.writeHead(200, {
      'Content-Type': fileMimeType,
      'Content-Disposition': 'inline',
    });
    fileStream.pipe(res);
    fileStream.on('error', (err) => {
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: getErrorMessage(err, 'Error viewing file'),
        });
      } else {
        res.end();
      }
    });

  } catch (e) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(e),
    });
  }
});


router.delete('/:fileId', async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const fileMetadata = await fileService.getFileMetadata(fileId);
    if (!fileMetadata || !fileMetadata.url) {
      res.status(404).json({
        success: false,
        message: 'File not found or upload not complete',
      });
      return;
    }

    await fileService.deleteFile(fileId);
    res.status(200).json({
      success: true,
    });

  } catch (e) {
    res.status(500).json({
      success: false,
      message: getErrorMessage(e),
    });
  }
});


export default router;