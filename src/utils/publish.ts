/**
 * This module handles the concerns of publishing. It handles interaction with
 * git tagging, pushing to the git origin, the package registry, etc.
 */
import * as Pacman from '../lib/pacman'
import createGit from 'simple-git/promise'

type Options = {
  /**
   * Should the semver git tag have a "v" prefix.
   */
  gitTagVPrefix?: boolean
}

const defaultOpts: Options = {
  gitTagVPrefix: false,
}

type Release = {
  /**
   * The version to publish.
   */
  version: string
  /**
   * The npm dist tag to use for this release.
   */
  distTag: string
  additiomalDistTags?: string[]
}

/**
 * Run the publishing process.
 *
 * 1. Change package.json version field to be new version.
 * 2. npm publish --tag next.
 * 3. discard package.json change.
 * 4. git tag {newVer}.
 * 5. git tag next.
 * 6. git push --tags.
 *
 */
export async function publish(release: Release, givenOpts?: Options) {
  const opts = {
    ...defaultOpts,
    ...givenOpts,
  }

  // publish to the npm registry
  //
  // If we are using a script runner then publish with that same tool. Otherwise
  // default to using npm. The reason we need to do this is that problems occur
  // when mixing tools. For example `yarn run ...` will lead to a spawn of `npm
  // publish` failing due to an authentication error.
  const pacman = await Pacman.create({ defualt: 'npm' })
  await pacman.publish({ version: release.version, tag: release.distTag })
  console.log('published package to the npm registry')

  // When publishing it is sometimes desirable to update other dist tags to
  // point at the new version. For example "next" should never fall behind stable,
  // etc.
  //
  // todo parallel optimize?
  if (release.additiomalDistTags) {
    for (const distTag of release.additiomalDistTags) {
      await pacman.tag({ packageVersion: release.version, tagName: distTag })
      console.log(`updated dist-tag "${distTag}" to point at this version`)
    }
  }

  // While the fields of the package.json should not have changed, its
  // formatting, like indentation level, might have. We do not want to leave a
  // dirty working directoy on the user's system.
  //
  // TODO no invariant in system that checks that package.json was not modified
  // before beginning the publishing process. In other words we may be losing
  // user work here. This check should be in strict mode.
  const git = createGit()
  await git.checkout('package.json')
  console.log('reverted package.json changes now that publishing is done')

  // Tag the git commit
  //
  const versionTag = opts.gitTagVPrefix
    ? 'v' + release.version
    : release.version
  await git.addAnnotatedTag(versionTag, versionTag)
  console.log(`tagged this commit with ${versionTag}`)

  // Push the git commits
  //
  await git.pushTags()
  console.log(`pushed tag to remote`)
}