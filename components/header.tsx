export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex font-semibold tracking-tighter text-xl pb-3 font-sans">
      {children}
    </div>
  );
}
