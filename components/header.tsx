export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex justify-between font-semibold tracking-tighter h-13 font-sans">
      {children}
    </div>
  );
}
