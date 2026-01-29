export function Title({children}: {children?: React.ReactNode}) {
  return <h1 className="text-2xl font-semibold mb-1 text-center">
        {children}
      </h1>
}

export function SubTitle({children}: {children?: React.ReactNode}) {
  return   <p className="text-gray-500 mb-6 text-sm text-center">
        {children}
      </p>
}