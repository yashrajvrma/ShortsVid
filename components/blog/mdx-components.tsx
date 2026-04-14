import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";

function YouTube({ id }: { id: string }) {
  return (
    <div className="my-8">
      <iframe
        width="100%"
        height="400"
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video"
        allowFullScreen
        loading="lazy"
        className="rounded-xl"
      />
    </div>
  );
}

export function getMDXComponents(): MDXComponents {
  return {
    YouTube,

    h1: ({ children }) => (
      <h1 className="text-3xl font-bold tracking-tight mt-10 mb-4 text-foreground">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-3 text-foreground border-b border-border pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold tracking-tight mt-8 mb-2 text-foreground">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-base leading-7 text-muted-foreground mb-5">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <Link
        href={href ?? "#"}
        className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
      >
        {children}
      </Link>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-outside ml-5 mb-5 space-y-1.5 text-muted-foreground">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-outside ml-5 mb-5 space-y-1.5 text-muted-foreground">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="text-base leading-7">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-5 my-6 italic text-muted-foreground bg-muted/40 py-3 pr-4 rounded-r-lg">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-muted text-foreground text-sm px-1.5 py-0.5 rounded font-mono">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-secondary text-secondary-foreground rounded-xl p-5 overflow-x-auto my-6 text-sm font-mono leading-relaxed">
        {children}
      </pre>
    ),
    hr: () => <hr className="my-8 border-border" />,
    img: ({ src, alt }) => (
      <span className="block my-6 rounded-xl overflow-hidden">
        {src && (
          <Image
            src={src ?? ""}
            alt={alt ?? ""}
            width={800}
            height={450}
            className="w-full object-cover rounded-xl"
          />
        )}
      </span>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
  };
}
