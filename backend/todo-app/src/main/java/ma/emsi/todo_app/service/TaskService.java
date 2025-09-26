package ma.emsi.todo_app.service;

import ma.emsi.todo_app.dto.TaskCreateRequest;
import ma.emsi.todo_app.dto.TaskDTO;
import ma.emsi.todo_app.model.Task;
import ma.emsi.todo_app.repository.TaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TaskService{

    TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }


    public TaskDTO createTask(TaskCreateRequest req) {
        Task toSave = new Task(4L, req.description());
        Task saved = taskRepository.save(toSave);
        return toDto(saved);
    }

    public List<TaskDTO> getTasks() {
        return taskRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public TaskDTO getTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
        return toDto(task);
    }


    public void deleteTask(Long id) {
        boolean deleted = taskRepository.deleteById(id);
        if (!deleted) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
        }
    }


    public TaskDTO updateTask(Long id, TaskCreateRequest req) {
        Task existing = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        existing.setDescription(req.description());
        Task saved = taskRepository.update(existing);
        return toDto(saved);
    }


    private TaskDTO toDto(Task task) {
        return new TaskDTO(task.getId(), task.getDescription());
    }





}
