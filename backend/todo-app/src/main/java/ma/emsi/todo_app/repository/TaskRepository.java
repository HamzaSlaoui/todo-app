package ma.emsi.todo_app.repository;

import ma.emsi.todo_app.model.Task;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class TaskRepository {

    private static List<Task> TASKS = new ArrayList<Task>();;

    static {
        TASKS.add(new Task(1L, "task one"));
        TASKS.add(new Task(2L, "task two"));
        TASKS.add(new Task(3L, "task three"));
    }

    public List<Task> findAll(){
        return TASKS;
    }

    public Task save(Task task){
        TASKS.add(task);
        return task;
    }

    public Optional<Task> findById(Long id){
        return TASKS.stream().filter((task) -> task.getId().equals(id)).findFirst();
    }

    public boolean deleteById(Long id){
        return findById(id)
                .map(task -> TASKS.remove(task))
                .orElse(false);
    }

    public Task update(Task task){
        int index = TASKS.indexOf(task);
        TASKS.set(index, task);
        return TASKS.get(index);
    }

}
