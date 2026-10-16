package com.realestate.aura.media;

import com.realestate.aura.exception.BadRequestException;
import com.realestate.aura.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class MediaService {

    private final MediaRepository mediaRepository;

    @Value("${app.storage.upload-dir:./uploads}")
    private String uploadDir;

    public MediaService(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    public List<MediaAsset> getAllMedia() {
        return mediaRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public MediaAsset getMediaById(Long id) {
        return mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media asset not found with id: " + id));
    }

    public MediaAsset uploadFile(MultipartFile file, String altText, String caption, String folder) {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        try {
            Path root = Paths.get(uploadDir);
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "asset";
            String cleanName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
            String filename = UUID.randomUUID().toString() + "_" + cleanName;
            Path targetPath = root.resolve(filename);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String mimeType = file.getContentType();
            String fileType = "DOCUMENT";
            if (mimeType != null) {
                if (mimeType.startsWith("image/")) {
                    fileType = "IMAGE";
                } else if (mimeType.startsWith("video/")) {
                    fileType = "VIDEO";
                } else if (filename.endsWith(".glb") || filename.endsWith(".gltf")) {
                    fileType = "MODEL_3D";
                }
            }

            MediaAsset asset = new MediaAsset();
            asset.setFilename(filename);
            asset.setOriginalName(originalName);
            asset.setUrl("/uploads/" + filename);
            asset.setFileType(fileType);
            asset.setMimeType(mimeType);
            asset.setFileSize(file.getSize());
            asset.setAltText(altText);
            asset.setCaption(caption);
            asset.setFolder(folder != null ? folder : "general");

            return mediaRepository.save(asset);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

    public MediaAsset registerExternalMedia(MediaAsset asset) {
        return mediaRepository.save(asset);
    }

    public MediaAsset updateMedia(Long id, String altText, String caption, String folder) {
        MediaAsset asset = getMediaById(id);
        asset.setAltText(altText);
        asset.setCaption(caption);
        if (folder != null) asset.setFolder(folder);
        return mediaRepository.save(asset);
    }

    public void deleteMedia(Long id) {
        MediaAsset asset = getMediaById(id);
        mediaRepository.delete(asset);
    }
}
