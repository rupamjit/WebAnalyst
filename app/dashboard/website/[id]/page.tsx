import WebsiteAnalyticsDashboard from '@/components/WebsiteAnalyticsDashboard'


interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;
  
  return (
    <div>
      <WebsiteAnalyticsDashboard websiteId={id} />
    </div>
  )
}

export default page