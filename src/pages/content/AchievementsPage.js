import ContentManager from './ContentManager';
import { CONTENT_CONFIGS } from './contentConfigs';

export default function AchievementsPage() {
  return <ContentManager config={CONTENT_CONFIGS.achievements} />;
}
