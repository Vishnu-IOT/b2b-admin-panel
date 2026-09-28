import ContentManager from './ContentManager';
import { CONTENT_CONFIGS } from './contentConfigs';

export default function VideosPage() {
  return <ContentManager config={CONTENT_CONFIGS.videos} />;
}
