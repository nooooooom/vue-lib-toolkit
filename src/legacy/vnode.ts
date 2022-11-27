import { isArray } from '@vue/shared'

import { mergedClass, mergedStyle, mergeListeners } from '../vnode'

export function legacyCloneVNode(
  vnode: any,
  extraProps: Record<string, any> | null,
  mergeRef = false
) {
  if (!vnode) {
    return
  }

  if (!extraProps) {
    extraProps = {}
  }

  const cloned = new vnode.constructor(
    vnode.tag,
    { ...vnode.data },
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    { ...vnode.componentOptions },
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  cloned.isCloned = true

  const data = cloned.data

  data.scopedSlots = {
    ...data.scopedSlots,
    ...extraProps.scopedSlots
  }
  data.class = mergedClass(data.class, extraProps.class)
  data.staticClass = mergedClass(data.staticClass, extraProps.staticClass)
  data.style = mergedStyle(data.style, extraProps.style)
  data.staticStyle = mergedStyle(data.staticStyle, extraProps.staticStyle)
  data.props = { ...data.props, ...extraProps.props }
  data.attrs = { ...data.attrs, ...extraProps.attrs }
  data.domProps = { ...data.domProps, ...extraProps.domProps }
  data.on = mergeListeners(data.on, extraProps.on, extraProps.nativeOn)
  data.directives = [...(data.directives || []), ...(extraProps.directives || [])]
  data.key = data.key ?? extraProps.key
  cloned.key = cloned.key ?? extraProps.key

  const componentOptions = cloned.componentOptions
  if (componentOptions) {
    componentOptions.propsData = { ...(componentOptions.propsData || {}) }
    componentOptions.listeners = { ...(componentOptions.listeners || {}) }
    componentOptions.propsData = {
      ...componentOptions.propsData,
      ...extraProps.props
    }
    componentOptions.listeners = mergeListeners(componentOptions.listeners, extraProps.on)
    if (extraProps.children) {
      componentOptions.children = extraProps.children
    }
  }

  const { ref } = cloned
  cloned.ref = extraProps.ref
    ? mergeRef && ref
      ? isArray(ref)
        ? ref.concat(extraProps.ref)
        : [ref, extraProps.ref]
      : extraProps.ref
    : ref

  return cloned
}
