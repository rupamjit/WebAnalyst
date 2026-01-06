import { cn } from "@/lib/utils"


const Container = ({className,children}: {className?: string,children: React.ReactNode}) => {
  return (
    <div className={cn(" mx-auto px-2 sm:px-4 lg:px-8",className)}>
        {children}
    </div>
  )
}

export default Container