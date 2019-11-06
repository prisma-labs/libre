import { spawnSync, SpawnSyncOptions } from 'child_process'
import * as path from 'path'

type RunResult = { stderr: string; stdout: string; status: null | number }
type RunOptions = Omit<SpawnSyncOptions, 'encoding'>

const run = (command: string, options?: RunOptions): RunResult => {
  const [name, ...args] = command.split(' ')
  const { stderr, stdout, status } = spawnSync(name, args, {
    ...options,
    encoding: 'utf8',
  })
  return { stderr, stdout, status }
}

const createLibreRunner = (optionsBase?: RunOptions) => (
  command: string,
  options?: RunOptions
) => {
  const mergedOptions = { ...optionsBase, ...options }
  // TODO Why is the extra `../` needed...
  const pathToProject =
    '../' +
    path.relative(
      (mergedOptions as any)['cwd'] || '.',
      path.join(__dirname, '..')
    )
  // console.log(pathToProject)
  return run(
    `${pathToProject}/node_modules/.bin/ts-node --project ${pathToProject}/tsconfig.json ${pathToProject}/src/main ${command}`,
    mergedOptions
  )
}

export { run, createLibreRunner }
