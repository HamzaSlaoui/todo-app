package ma.emsi.todo_app.controller;

import ma.emsi.todo_app.dto.TaskCreateRequest;
import ma.emsi.todo_app.dto.TaskDTO;
import ma.emsi.todo_app.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;


@RestController
public class TaskController {

    TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping(value = "/tasks")
    public ResponseEntity<List<TaskDTO>> getTasks() {
        List<TaskDTO> tasks = taskService.getTasks();
        if (tasks.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(tasks);
    }

    @PostMapping(value = "/tasks")
    public ResponseEntity<TaskDTO> createTask(@Validated @RequestBody TaskCreateRequest body,
                                              UriComponentsBuilder uriBuilder) {
        TaskDTO created = taskService.createTask(body);
        URI location = uriBuilder.path("/{id}")
                .buildAndExpand(created.id())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    @GetMapping("/tasks/{id}")
    public TaskDTO getTask(@PathVariable Long id) {
        return taskService.getTask(id);
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/tasks/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable(name = "id") Long id,
                                              @Validated @RequestBody TaskCreateRequest body) {
        TaskDTO updated = taskService.updateTask(id, body);
        return ResponseEntity.ok(updated);
    }

}
