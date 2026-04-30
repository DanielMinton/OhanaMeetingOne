import MinutesView from '@/components/minutes/MinutesView';

export default async function MinutesPage({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}) {
  const { meetingId } = await params;
  return <MinutesView meetingId={meetingId} />;
}
