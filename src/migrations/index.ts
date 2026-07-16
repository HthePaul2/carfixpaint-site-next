import * as migration_20260715_140848_initial from './20260715_140848_initial'
import * as migration_20260715_144136 from './20260715_144136'
import * as migration_20260715_144639 from './20260715_144639'
import * as migration_20260715_194500_review_verification from './20260715_194500_review_verification'
import * as migration_20260716_001200_portfolio_og_image from './20260716_001200_portfolio_og_image'
import * as migration_20260716_003000_portfolio_default_og from './20260716_003000_portfolio_default_og'
import * as migration_20260716_070000_service_landing_pages from './20260716_070000_service_landing_pages'
import * as migration_20260716_073000_reviews_has_comment from './20260716_073000_reviews_has_comment'
import * as migration_20260716_080000_contact_attachments from './20260716_080000_contact_attachments'

export const migrations = [
  {
    up: migration_20260715_140848_initial.up,
    down: migration_20260715_140848_initial.down,
    name: '20260715_140848_initial',
  },
  {
    up: migration_20260715_144136.up,
    down: migration_20260715_144136.down,
    name: '20260715_144136',
  },
  {
    up: migration_20260715_144639.up,
    down: migration_20260715_144639.down,
    name: '20260715_144639',
  },
  {
    up: migration_20260715_194500_review_verification.up,
    down: migration_20260715_194500_review_verification.down,
    name: '20260715_194500_review_verification',
  },
  {
    up: migration_20260716_001200_portfolio_og_image.up,
    down: migration_20260716_001200_portfolio_og_image.down,
    name: '20260716_001200_portfolio_og_image',
  },
  {
    up: migration_20260716_003000_portfolio_default_og.up,
    down: migration_20260716_003000_portfolio_default_og.down,
    name: '20260716_003000_portfolio_default_og',
  },
  {
    up: migration_20260716_070000_service_landing_pages.up,
    down: migration_20260716_070000_service_landing_pages.down,
    name: '20260716_070000_service_landing_pages',
  },
  {
    up: migration_20260716_073000_reviews_has_comment.up,
    down: migration_20260716_073000_reviews_has_comment.down,
    name: '20260716_073000_reviews_has_comment',
  },
  {
    up: migration_20260716_080000_contact_attachments.up,
    down: migration_20260716_080000_contact_attachments.down,
    name: '20260716_080000_contact_attachments',
  },
]
