import {type ForwardedRef, forwardRef, type ReactNode, useContext, useMemo} from 'react'
import {useUnique} from 'sanity'
import {PaneRouterContext} from 'sanity/_singletons'
import {StateLink} from 'sanity/router'

interface ParameterizedLinkProps {
  params?: Record<string, string>
  payload?: unknown
  children?: ReactNode
}

/**
 * @internal
 */
export const ParameterizedLink = forwardRef(function ParameterizedLink(
  props: ParameterizedLinkProps,
  ref: ForwardedRef<HTMLAnchorElement>,
) {
  const {routerPanesState: currentPanes, groupIndex, siblingIndex} = useContext(PaneRouterContext)
  const {params, payload, ...rest} = props
  const nextParams = useUnique(params)
  const nextPayload = useUnique(payload)

  const nextState = useMemo(() => {
    const currentGroup = currentPanes[groupIndex]
    const currentSibling = currentGroup[siblingIndex]

    const nextSibling = {
      ...currentSibling,
      params: nextParams ?? currentSibling.params,
      payload: nextPayload ?? currentSibling.payload,
    }

    const nextGroup = [
      ...currentGroup.slice(0, siblingIndex),
      nextSibling,
      ...currentGroup.slice(siblingIndex + 1),
    ]

    const nextPanes = [
      ...currentPanes.slice(0, groupIndex),
      nextGroup,
      ...currentPanes.slice(groupIndex + 1),
    ]

    return {panes: nextPanes}
  }, [currentPanes, groupIndex, nextParams, nextPayload, siblingIndex])

  return <StateLink ref={ref} {...rest} state={nextState} />
})
