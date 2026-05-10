const BottomNav = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--border)] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-xs uppercase tracking-[0.2em] text-[var(--slate)]">
        <span>Home</span>
        <span>Trips</span>
        <span>Itinerary</span>
        <span>Budget</span>
        <span>Profile</span>
      </div>
    </nav>
  );
};

export default BottomNav;
