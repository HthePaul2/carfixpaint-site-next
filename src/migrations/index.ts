import * as migration_20260715_140848_initial from './20260715_140848_initial'
import * as migration_20260715_144136 from './20260715_144136'
import * as migration_20260715_144639 from './20260715_144639'
import * as migration_20260715_194500_review_verification from './20260715_194500_review_verification'

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
]
