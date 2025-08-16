import { Todo } from '../types';
import TodoItem from './TodoItem';
// Import modern icons from Lucide React
import { Target, Search as SearchIcon } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder?: (startIndex: number, endIndex: number) => void;
  searchQuery?: string;
}

export default function TodoList({ todos, onToggle, onDelete, onReorder, searchQuery }: TodoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    if (!onReorder) return;
    
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over?.id);
      
      onReorder(oldIndex, newIndex);
    }
  }
  if (todos.length === 0) {
    return (
      <div id="todo-list-empty-message" className="glass-card rounded-2xl p-10 text-center fade-in border border-white/30 w-full">
        <div className="space-y-4">
          <div className="text-5xl animate-pulse-custom mb-2" style={{ display: 'flex', justifyContent: 'center' }}>
            {searchQuery ? <SearchIcon size={48} color="#6b7280" /> : <Target size={48} color="#6b7280" />}
          </div>
          <h3 className="text-xl font-bold text-gray-600">
            {searchQuery ? 'No matches found' : 'Ready to be productive?'}
          </h3>
          <p className="text-gray-500">
            {searchQuery 
              ? `No todos match "${searchQuery}". Try a different search term.`
              : 'Create your first todo above and start achieving your goals!'
            }
          </p>
          <div className="flex justify-center space-x-2 pt-3">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
          </div>
        </div>
      </div>
    );
  }

  const todoItems = todos.map((todo, index) => (
    <div 
      key={todo.id} 
      className="slide-in"
      style={{animationDelay: `${index * 0.05}s`}}
    >
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onDelete={onDelete}
        showDragHandle={!!onReorder}
      />
    </div>
  ));

  return (
    <div id="todo-list-section" className="fade-in w-full">
      {onReorder ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={todos} strategy={verticalListSortingStrategy}>
            <div id="todo-list-container" className="space-y-3 w-full">
              {todoItems}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div id="todo-list-container" className="space-y-3 w-full">
          {todoItems}
        </div>
      )}
      
      {todos.length > 0 && (() => {
        const remainingTodos = todos.filter(todo => !todo.completed).length;
        
        if (remainingTodos === 0) {
          return (
            <div id="todo-list-congratulations-message" className="text-center pt-3 fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 backdrop-blur-sm rounded-full text-sm font-semibold text-green-700 border border-green-200/50 whitespace-nowrap">
                <span>🎉</span>
                <span>Congratulations! All tasks completed!</span>
                <span>✨</span>
              </div>
            </div>
          );
        }
        
        return (
          <div id="todo-list-footer-message" className="text-center pt-3 fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/40 backdrop-blur-sm rounded-full text-sm text-gray-600 border border-white/30 whitespace-nowrap">
              <span>💪</span>
              <span>You've {remainingTodos} remaining item{remainingTodos === 1 ? '' : 's'} to complete!</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}