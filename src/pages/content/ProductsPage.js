import ContentManager from './ContentManager';
import { CONTENT_CONFIGS } from './contentConfigs';

export default function ProductsPage() {
  return <ContentManager config={CONTENT_CONFIGS.products} />;
}
