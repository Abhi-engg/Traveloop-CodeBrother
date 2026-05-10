const BottomNav = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 text-sm">
        <span>Dashboard</span>
        <span>Trips</span>
        <span>Budget</span>
        <span>Profile</span>
      </div>
    </nav>
  );
};

export default BottomNav;
