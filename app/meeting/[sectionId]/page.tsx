import MeetingExperience from '@/components/meeting/MeetingExperience';

export default async function MeetingSectionPage({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}) {
  const { sectionId } = await params;
  return <MeetingExperience initialSectionId={sectionId} />;
}
