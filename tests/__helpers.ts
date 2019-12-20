import { spawnSync, SpawnSyncOptions } from 'child_process'
import * as path from 'path'
import * as proc from '../src/lib/proc'

const createLibreRunner = (optionsBase?: proc.RunOptions) => (
  command: string,
  options?: proc.RunOptions
): Promise<Omit<proc.SuccessfulRunResult, 'command'>> => {
  const mergedOptions = { ...optionsBase, ...options }
  // TODO Why is the extra `../` needed...
  const pathToProject =
    '../' +
    path.relative(
      (mergedOptions as any)['cwd'] || '.',
      path.join(__dirname, '..')
    )
  // console.log(pathToProject)
  return proc
    .run(
      `${pathToProject}/node_modules/.bin/ts-node --project ${pathToProject}/tsconfig.json ${pathToProject}/src/main ${command}`,
      mergedOptions
    )
    .then(result => {
      delete result.command
      return result
    })
}

export { createLibreRunner }
