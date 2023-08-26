import settings from '@/settings/basic'

export function setTitle(title) {
  document.title = title + ' | ' + settings.appName
}

export function encodeObject(o) {
  return btoa(encodeURI(JSON.stringify(o)))
}

export function decodeObject(o) {
  return JSON.parse(decodeURI(atob(o)))
}

export function fmtForm(object, keys) {
  const subset = {};

  for (const key of keys) {
    if (object.hasOwnProperty(key)) {
      subset[key] = object[key];
    }
  }
  return subset;
}