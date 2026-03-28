export default function Header({ children }: { children?: React.ReactNode }) {
  return <div className="flex font-medium tracking-tight py-4">{children}</div>;
}
