import ContentManager from './ContentManager';
import { CONTENT_CONFIGS } from './contentConfigs';

export default function StoriesPage() {
  return <ContentManager config={CONTENT_CONFIGS.stories} />;
}
