import type { MDXComponents } from "mdx/types"
import Image from "next/image"
import Link from "next/link"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // // Use custom components for markdown elements
    // h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    // h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
    // h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
    // p: ({ children }) => <p className="mb-4">{children}</p>,
    a: ({ href, children }) => (
      <Link href={href || "#"} className="">
        {children}
      </Link>
    ),
    // ),
    // ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
    // ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
    // li: ({ children }) => <li className="mb-1">{children}</li>,
    code: ({ children }) => <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{children}</code>,
    pre: ({ children }) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        className="rounded-lg my-6"
        alt={props.alt || ""}
        {...props}
      />
    ),
    ...components,
  }
}

