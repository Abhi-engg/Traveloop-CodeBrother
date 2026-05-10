import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { mockAvailableActivities, initialItineraryColumns } from "../data/mockData";

// Sortable Item Component
const SortableActivityItem = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const getIcon = (type) => {
    switch (type) {
      case 'food': return '🍽️';
      case 'sightseeing': return '📸';
      case 'lodging': return '🏨';
      case 'tour': return '🚶';
      case 'nightlife': return '🍷';
      default: return '📍';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3 cursor-grab hover:shadow-md transition-shadow group"
    >
      <div className="text-xl bg-gray-50 dark:bg-gray-700 w-10 h-10 rounded-lg flex items-center justify-center">
        {getIcon(item.type)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.name}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {item.time && `${item.time} • `} ₹{item.cost.toLocaleString()}
        </p>
      </div>
      <div className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
      </div>
    </div>
  );
};

const ItineraryBuilder = () => {
  const [columns, setColumns] = useState(initialItineraryColumns);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    // Find the container (day) that holds the active item
    let activeContainerId = null;
    let overContainerId = null;

    Object.keys(columns).forEach(key => {
      if (columns[key].items.find(i => i.id === active.id)) activeContainerId = key;
      if (columns[key].id === over.id || columns[key].items.find(i => i.id === over.id)) overContainerId = key;
    });

    if (!activeContainerId || !overContainerId) return;

    if (activeContainerId === overContainerId) {
      const day = columns[activeContainerId];
      const oldIndex = day.items.findIndex(i => i.id === active.id);
      const newIndex = day.items.findIndex(i => i.id === over.id);

      if (oldIndex !== newIndex) {
        setColumns({
          ...columns,
          [activeContainerId]: {
            ...day,
            items: arrayMove(day.items, oldIndex, newIndex),
          }
        });
      }
    } else {
      // Cross-container drag (simplified, just moving to the end of the new container for now)
      const activeItems = [...columns[activeContainerId].items];
      const overItems = [...columns[overContainerId].items];

      const activeIndex = activeItems.findIndex(i => i.id === active.id);
      const [movedItem] = activeItems.splice(activeIndex, 1);

      overItems.push(movedItem); // Push to end

      setColumns({
        ...columns,
        [activeContainerId]: { ...columns[activeContainerId], items: activeItems },
        [overContainerId]: { ...columns[overContainerId], items: overItems }
      });
    }
  };

  const addActivityToDay = (activity, dayId) => {
    const day = columns[dayId];
    const newItem = {
      id: `i-${Date.now()}`,
      name: activity.name,
      type: activity.type,
      cost: activity.cost,
      time: 'TBD'
    };
    
    setColumns({
      ...columns,
      [dayId]: {
        ...day,
        items: [...day.items, newItem]
      }
    });
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row overflow-hidden bg-[var(--cream)] dark:bg-gray-950 transition-colors">
      
      {/* Header for mobile, hidden on large screens since we have a full layout */}
      <div className="md:hidden p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center z-10 shadow-sm">
        <h1 className="font-bold text-[var(--indigo)] dark:text-white">Rajasthan Royal Route</h1>
        <Link to="/budget" className="text-xs bg-[#ff6b47] text-white px-3 py-1.5 rounded-full font-bold">View Budget</Link>
      </div>

      {/* PANEL 1: Stops Sidebar (Left) */}
      <div className="w-full md:w-64 lg:w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 flex flex-col h-full overflow-y-auto hidden md:flex">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-[var(--indigo)] text-white">
          <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-1">Editing Trip</p>
          <h2 className="text-xl font-bold mb-4">Rajasthan Royal Route</h2>
          
          <div className="flex gap-2">
            <Link to="/budget" className="flex-1 bg-white/10 hover:bg-white/20 text-center py-2 rounded-lg text-xs font-semibold transition-colors">Budget</Link>
            <Link to="/share" className="flex-1 bg-white/10 hover:bg-white/20 text-center py-2 rounded-lg text-xs font-semibold transition-colors">Share</Link>
          </div>
        </div>
        
        <div className="p-4 flex-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 px-2">Itinerary Stops</h3>
          
          <div className="space-y-1 relative">
            <div className="absolute left-4 top-4 bottom-4 w-px bg-gray-200 dark:bg-gray-700 z-0" />
            
            <div className="relative z-10 flex items-center gap-3 p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-[var(--indigo)] dark:text-indigo-300 font-medium">
              <div className="w-4 h-4 rounded-full bg-[var(--indigo)] border-2 border-white dark:border-gray-900 shadow-sm" />
              <span>Jaipur (3 days)</span>
            </div>
            
            <div className="relative z-10 flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400 font-medium cursor-pointer transition-colors">
              <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-900 shadow-sm" />
              <span>Udaipur (4 days)</span>
            </div>
            
            <div className="relative z-10 flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400 font-medium cursor-pointer transition-colors">
              <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-900 shadow-sm" />
              <span>Jodhpur (3 days)</span>
            </div>
          </div>
        </div>
      </div>

      {/* PANEL 2: Day Canvas (Center) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[var(--cream)] dark:bg-gray-950 custom-scrollbar">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[var(--indigo)] dark:text-white">Jaipur</h2>
              <p className="text-gray-500 dark:text-gray-400">June 15 - June 18</p>
            </div>
            <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-shadow dark:text-white">
              Optimize Route
            </button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="space-y-8 pb-20">
              {Object.values(columns).map((day) => (
                <div key={day.id} className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-[2rem] p-6 border border-white/50 dark:border-gray-800 shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-[var(--indigo)] dark:text-white">{day.title}</h3>
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{day.date}</span>
                  </div>
                  
                  <div className="space-y-3 min-h-[50px]">
                    <SortableContext items={day.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                      {day.items.map(item => (
                        <SortableActivityItem key={item.id} item={item} />
                      ))}
                      {day.items.length === 0 && (
                        <div className="h-20 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                          Drag activities here
                        </div>
                      )}
                    </SortableContext>
                  </div>
                </div>
              ))}
            </div>
          </DndContext>
        </div>
      </div>

      {/* PANEL 3: Activity Search (Right) */}
      <div className="w-full md:w-80 lg:w-[350px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex-shrink-0 flex flex-col h-[50vh] md:h-full border-t md:border-t-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] md:shadow-none z-20">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-[var(--indigo)] dark:text-white mb-3">Discover Jaipur</h3>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search places, food..." 
              className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--indigo)] dark:text-white transition-shadow"
            />
            <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar pb-1">
            {['All', 'Food', 'Heritage', 'Shopping'].map(filter => (
              <button key={filter} className="whitespace-nowrap px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-[var(--indigo)] hover:text-white transition-colors">
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50/50 dark:bg-gray-900/50">
          {mockAvailableActivities.map((activity) => (
            <div key={activity.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group">
              <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${activity.image})` }}>
                <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <span className="text-white font-bold text-sm shadow-sm">{activity.name}</span>
                </div>
              </div>
              <div className="p-3">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">
                  <span className="flex items-center gap-1">⭐ {activity.rating}</span>
                  <span>{activity.duration}</span>
                  <span>₹{activity.cost}</span>
                </div>
                <button 
                  onClick={() => addActivityToDay(activity, 'day-1')}
                  className="w-full py-2 bg-indigo-50 dark:bg-indigo-900/30 text-[var(--indigo)] dark:text-indigo-300 font-bold text-xs rounded-xl hover:bg-[var(--indigo)] hover:text-white dark:hover:bg-indigo-500 transition-colors"
                >
                  + Add to Day 1
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
};

export default ItineraryBuilder;
