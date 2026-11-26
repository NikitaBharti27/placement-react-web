import { GAME_TYPES } from '../../../config/companyGamifiedCriteria'
import PathFinderGame from './PathFinderGame'
import BubbleMathGame from './BubbleMathGame'
import KeyDoorMazeGame from './KeyDoorMazeGame'
import GridMemoryGame from './GridMemoryGame'

const GAME_COMPONENTS = {
  [GAME_TYPES.PATH_FINDER]: PathFinderGame,
  [GAME_TYPES.BUBBLE_MATH]: BubbleMathGame,
  [GAME_TYPES.KEY_DOOR]: KeyDoorMazeGame,
  [GAME_TYPES.GRID_MEMORY]: GridMemoryGame,
}

/**
 * Uniform dispatcher rendering the requested cognitive game component.
 * Keyed by stage/game identity so switching stages resets local board state cleanly.
 */
export const GamifiedGameHost = ({
  gameType,
  config = {},
  stageNumber = 1,
  mode = 'ranked',
  onRawEvent,
  onComplete,
}) => {
  const GameComponent = GAME_COMPONENTS[gameType] || PathFinderGame

  return (
    <GameComponent
      key={`${gameType}-stage-${stageNumber}-${JSON.stringify(config)}`}
      config={config}
      stageNumber={stageNumber}
      mode={mode}
      onRawEvent={onRawEvent}
      onComplete={onComplete}
    />
  )
}

export default GamifiedGameHost
