import {type AssetSource, type SchemaTypeDefinition} from '@sanity/types'
import {type ReactNode} from 'react'

import {type LocaleConfigContext, type LocaleDefinition, type LocaleResourceBundle} from '../i18n'
import {type Template, type TemplateItem} from '../templates'
import {getPrintableType} from '../util/getPrintableType'
import {
  type DocumentActionComponent,
  type DocumentBadgeComponent,
  type DocumentInspector,
} from './document'
import {flattenConfig} from './flattenConfig'
import {
  type AsyncConfigPropertyReducer,
  type ConfigContext,
  type ConfigPropertyReducer,
  type DocumentActionsContext,
  type DocumentBadgesContext,
  type DocumentCommentsEnabledContext,
  type DocumentInspectorContext,
  type DocumentLanguageFilterComponent,
  type DocumentLanguageFilterContext,
  type NewDocumentOptionsContext,
  type PluginOptions,
  type ResolveProductionUrlContext,
  type Tool,
} from './types'

export const initialDocumentBadges: DocumentBadgeComponent[] = []

export const initialDocumentActions: DocumentActionComponent[] = []

export const initialLanguageFilter: DocumentLanguageFilterComponent[] = []

export const schemaTypesReducer: ConfigPropertyReducer<
  SchemaTypeDefinition[],
  Omit<ConfigContext, 'schema' | 'currentUser' | 'client' | 'getClient' | 'i18n'>
> = (prev, {schema}, context) => {
  const schemaTypes = schema?.types

  if (!schemaTypes) return prev
  if (typeof schemaTypes === 'function') return schemaTypes(prev, context)
  if (Array.isArray(schemaTypes)) return [...prev, ...schemaTypes]

  throw new Error(
    `Expected \`schema.types\` to be an array or a function, but received ${getPrintableType(
      schemaTypes,
    )}`,
  )
}

export const resolveProductionUrlReducer: AsyncConfigPropertyReducer<
  string | undefined,
  ResolveProductionUrlContext
> = async (prev, {document}, context) => {
  const resolveProductionUrl = document?.productionUrl
  // the redundant await is useful for error logging because the error is caught
  // in this stack vs somewhere down stream
  // eslint-disable-next-line no-return-await
  if (resolveProductionUrl) return await resolveProductionUrl(prev, context)
  return prev
}

export const toolsReducer: ConfigPropertyReducer<Tool[], ConfigContext> = (
  prev,
  {tools},
  context,
) => {
  if (!tools) return prev
  if (typeof tools === 'function') return tools(prev, context)
  if (Array.isArray(tools)) return [...prev, ...tools]

  throw new Error(
    `Expected \`tools\` to be an array or a function, but received ${getPrintableType(tools)}`,
  )
}

// we will need this when we ressurect user config for search
/*export const searchFilterReducer: ConfigPropertyReducer<
  SearchFilterDefinition<string>[],
  ConfigContext
> = (prev, {search}, context) => {
  const filters = search?.filters
  if (!filters) return prev
  if (typeof filters === 'function') return filters(prev, context)
  if (Array.isArray(filters)) return [...prev, ...filters]

  throw new Error(
    `Expected \`search.filters\` to be an array or a function, but received ${typeof filters}`
  )
}

export const searchOperatorsReducer: ConfigPropertyReducer<
  SearchOperatorDefinition[],
  ConfigContext
> = (prev, {search}, context) => {
  const operators = search?.operators
  if (!operators) return prev
  if (typeof operators === 'function') return operators(prev, context)
  if (Array.isArray(operators)) return [...prev, ...operators]

  throw new Error(
    `Expected \`operators\` to be be an array or a function, but received ${getPrintableType(operators)}`
  )
}*/

export const schemaTemplatesReducer: ConfigPropertyReducer<Template[], ConfigContext> = (
  prev,
  {schema},
  context,
) => {
  const schemaTemplates = schema?.templates
  if (!schemaTemplates) return prev
  if (typeof schemaTemplates === 'function') return schemaTemplates(prev, context)
  if (Array.isArray(schemaTemplates)) return [...prev, ...schemaTemplates]

  throw new Error(
    `Expected \`schema.templates\` to be an array or a function, but received ${getPrintableType(
      schemaTemplates,
    )}`,
  )
}

export const localeDefReducer: ConfigPropertyReducer<LocaleDefinition[], LocaleConfigContext> = (
  prev,
  {i18n},
  context,
) => {
  const locales = i18n?.locales
  if (!locales) return prev
  if (typeof locales === 'function') return locales(prev, context)
  if (Array.isArray(locales)) return [...prev, ...locales]

  throw new Error(
    `Expected \`i18n.locales\` to be an array or a function, but received ${getPrintableType(
      locales,
    )}`,
  )
}

export const localeBundlesReducer: ConfigPropertyReducer<
  LocaleResourceBundle[],
  LocaleConfigContext
> = (prev, {i18n}, context) => {
  const bundles = i18n?.bundles
  if (!bundles) return prev
  if (Array.isArray(bundles)) return [...prev, ...bundles]
  if (typeof bundles === 'function') return bundles(prev, context)

  throw new Error(
    `Expected \`i18n.bundles\` to be an array or a function, but received ${typeof bundles}`,
  )
}

export const documentBadgesReducer: ConfigPropertyReducer<
  DocumentBadgeComponent[],
  DocumentBadgesContext
> = (prev, {document}, context) => {
  const documentBadges = document?.badges
  if (!documentBadges) return prev

  if (typeof documentBadges === 'function') return documentBadges(prev, context)
  if (Array.isArray(documentBadges)) return [...prev, ...documentBadges]

  throw new Error(
    `Expected \`document.badges\` to be an array or a function, but received ${getPrintableType(
      documentBadges,
    )}`,
  )
}

export const documentActionsReducer: ConfigPropertyReducer<
  DocumentActionComponent[],
  DocumentActionsContext
> = (prev, {document}, context) => {
  const documentActions = document?.actions
  if (!documentActions) return prev

  if (typeof documentActions === 'function') return documentActions(prev, context)
  if (Array.isArray(documentActions)) return [...prev, ...documentActions]

  throw new Error(
    `Expected \`document.actions\` to be an array or a function, but received ${getPrintableType(
      documentActions,
    )}`,
  )
}

export const newDocumentOptionsResolver: ConfigPropertyReducer<
  TemplateItem[],
  NewDocumentOptionsContext
> = (prev, {document}, context) => {
  const resolveNewDocumentOptions = document?.newDocumentOptions
  if (!resolveNewDocumentOptions) return prev

  if (typeof resolveNewDocumentOptions !== 'function') {
    throw new Error(
      `Expected \`document.resolveNewDocumentOptions\` to be a function, but received ${getPrintableType(
        resolveNewDocumentOptions,
      )}`,
    )
  }

  return resolveNewDocumentOptions(prev, context)
}

export const fileAssetSourceResolver: ConfigPropertyReducer<AssetSource[], ConfigContext> = (
  prev,
  {form},
  context,
) => {
  const assetSources = form?.file?.assetSources
  if (!assetSources) return prev

  if (typeof assetSources === 'function') return assetSources(prev, context)
  if (Array.isArray(assetSources)) return [...prev, ...assetSources]

  throw new Error(
    `Expected \`form.file.assetSources\` to be an array or a function, but received ${getPrintableType(
      assetSources,
    )}`,
  )
}

export const imageAssetSourceResolver: ConfigPropertyReducer<AssetSource[], ConfigContext> = (
  prev,
  {form},
  context,
) => {
  const assetSources = form?.image?.assetSources
  if (!assetSources) return prev

  if (typeof assetSources === 'function') return assetSources(prev, context)
  if (Array.isArray(assetSources)) return [...prev, ...assetSources]

  throw new Error(
    `Expected \`form.image.assetSources\` to be an array or a function, but received ${getPrintableType(
      assetSources,
    )}`,
  )
}

/**
 * @internal
 */
export const documentLanguageFilterReducer: ConfigPropertyReducer<
  DocumentLanguageFilterComponent[],
  DocumentLanguageFilterContext
> = (prev, {document}, context) => {
  const resolveDocumentLanguageFilter = document?.unstable_languageFilter
  if (!resolveDocumentLanguageFilter) return prev

  if (typeof resolveDocumentLanguageFilter === 'function')
    return resolveDocumentLanguageFilter(prev, context)

  if (Array.isArray(resolveDocumentLanguageFilter))
    return [...prev, ...resolveDocumentLanguageFilter]

  throw new Error(
    `Expected \`document.unstable_languageFilter\` to be an array or a function, but received ${getPrintableType(
      resolveDocumentLanguageFilter,
    )}`,
  )
}

export const documentInspectorsReducer: ConfigPropertyReducer<
  DocumentInspector[],
  DocumentInspectorContext
> = (prev, {document}, context) => {
  const resolveInspectorsFilter = document?.inspectors
  if (!resolveInspectorsFilter) return prev

  if (typeof resolveInspectorsFilter === 'function') return resolveInspectorsFilter(prev, context)

  if (Array.isArray(resolveInspectorsFilter)) return [...prev, ...resolveInspectorsFilter]

  throw new Error(
    `Expected \`document.inspectors\` to be an array or a function, but received ${getPrintableType(
      resolveInspectorsFilter,
    )}`,
  )
}

export const documentCommentsEnabledReducer = (opts: {
  config: PluginOptions
  context: DocumentCommentsEnabledContext
  initialValue: boolean
}): boolean => {
  const {config, context, initialValue} = opts
  const flattenedConfig = flattenConfig(config, [])

  // There is no concept of 'previous value' in this API. We only care about the final value.
  // That is, if a plugin returns true, but the next plugin returns false, the result will be false.
  // The last plugin 'wins'.
  const result = flattenedConfig.reduce((acc, {config: innerConfig}) => {
    const resolver =
      innerConfig.document?.comments?.enabled ?? innerConfig.document?.unstable_comments?.enabled

    if (!resolver && typeof resolver !== 'boolean') return acc
    if (typeof resolver === 'function') return resolver(context)
    if (typeof resolver === 'boolean') return resolver

    throw new Error(
      `Expected \`document.comments.enabled\` to be a boolean or a function, but received ${getPrintableType(
        resolver,
      )}`,
    )
  }, initialValue)

  return result
}

export const arrayEditingReducer = (opts: {
  config: PluginOptions
  initialValue: boolean
}): boolean => {
  const {config, initialValue} = opts
  const flattenedConfig = flattenConfig(config, [])

  const result = flattenedConfig.reduce((acc, {config: innerConfig}) => {
    const resolver = innerConfig.beta?.treeArrayEditing?.enabled

    if (!resolver && typeof resolver !== 'boolean') return acc
    if (typeof resolver === 'boolean') return resolver

    throw new Error(
      `Expected \`beta.treeArrayEditing.enabled\` to be a boolean, but received ${getPrintableType(
        resolver,
      )}`,
    )
  }, initialValue)

  return result
}

export const internalTasksReducer = (opts: {
  config: PluginOptions
}): {footerAction: ReactNode} | undefined => {
  const {config} = opts
  const flattenedConfig = flattenConfig(config, [])

  const result = flattenedConfig.reduce(
    (acc: {footerAction: ReactNode} | undefined, {config: innerConfig}) => {
      const resolver = innerConfig.__internal_tasks

      if (!resolver) return acc
      if (typeof resolver === 'object' && resolver.footerAction) return resolver

      throw new Error(
        `Expected \`__internal__tasks\` to be an object with footerAction, but received ${getPrintableType(
          resolver,
        )}`,
      )
    },
    undefined,
  )

  return result
}

export const partialIndexingEnabledReducer = (opts: {
  config: PluginOptions
  initialValue: boolean
}): boolean => {
  const {config, initialValue} = opts
  const flattenedConfig = flattenConfig(config, [])

  const result = flattenedConfig.reduce((acc, {config: innerConfig}) => {
    const resolver = innerConfig.search?.unstable_partialIndexing?.enabled

    if (!resolver && typeof resolver !== 'boolean') return acc
    if (typeof resolver === 'boolean') return resolver

    throw new Error(
      `Expected \`search.unstable_partialIndexing.enabled\` to be a boolean, but received ${getPrintableType(
        resolver,
      )}`,
    )
  }, initialValue)

  return result
}

export const legacySearchEnabledReducer: ConfigPropertyReducer<boolean, ConfigContext> = (
  prev,
  {search},
): boolean => {
  if (typeof search?.enableLegacySearch !== 'undefined') {
    return search.enableLegacySearch
  }

  return prev
}
