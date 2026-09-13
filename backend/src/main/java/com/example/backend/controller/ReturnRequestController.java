package com.example.backend.controller;

import com.example.backend.entity.ReturnRequest;
import com.example.backend.entity.User;
import com.example.backend.security.AuthGuard;
import com.example.backend.service.ReturnRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/returns")
public class ReturnRequestController {

    @Autowired private ReturnRequestService returnService;
    @Autowired private AuthGuard authGuard;

    /** Khách hàng tạo yêu cầu đổi/trả hàng. */
    @PostMapping
    public ResponseEntity<Map<String, Object>> create(
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        User user = authGuard.requireUser(request);
        Long orderId = Long.parseLong(body.get("orderId"));
        ReturnRequest rr = returnService.create(
                user.getId(),
                orderId,
                body.get("reason"),
                body.get("description"),
                body.get("imageUrl")
        );
        return ResponseEntity.status(201).body(toMap(rr));
    }

    /** Khách hàng xem đơn đổi/trả của mình. */
    @GetMapping("/my")
    public List<Map<String, Object>> myReturns(HttpServletRequest request) {
        User user = authGuard.requireUser(request);
        return returnService.getByUser(user.getId()).stream()
                .map(this::toMap)
                .collect(Collectors.toList());
    }

    /** Admin xem tất cả yêu cầu đổi/trả. */
    @GetMapping
    public List<Map<String, Object>> allReturns(HttpServletRequest request) {
        authGuard.requireAdmin(request);
        return returnService.getAll().stream()
                .map(this::toMap)
                .collect(Collectors.toList());
    }

    /** Admin phê duyệt hoặc từ chối yêu cầu đổi/trả. */
    @PutMapping("/{id}/status")
    public Map<String, Object> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        authGuard.requireAdmin(request);
        return toMap(returnService.updateStatus(id, body.get("status"), body.get("adminNote")));
    }

    private Map<String, Object> toMap(ReturnRequest rr) {
        return Map.of(
            "id", rr.getId(),
            "orderId", rr.getOrder().getId(),
            "userId", rr.getUser().getId(),
            "username", rr.getUser().getUsername(),
            "reason", rr.getReason(),
            "description", rr.getDescription() != null ? rr.getDescription() : "",
            "imageUrl", rr.getImageUrl() != null ? rr.getImageUrl() : "",
            "status", rr.getStatus().name(),
            "adminNote", rr.getAdminNote() != null ? rr.getAdminNote() : "",
            "createdAt", rr.getCreatedAt() != null ? rr.getCreatedAt().toString() : ""
        );
    }
}
