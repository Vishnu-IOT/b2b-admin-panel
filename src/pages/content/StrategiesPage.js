import ContentManager from './ContentManager';
import { CONTENT_CONFIGS } from './contentConfigs';

export default function StrategiesPage() {
  return <ContentManager config={CONTENT_CONFIGS.strategies} />;
}
