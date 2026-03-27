export default function Header({ children }: { children?: React.ReactNode }) {
  return <div className="flex font-medium tracking-tight h-13">{children}</div>;
}
