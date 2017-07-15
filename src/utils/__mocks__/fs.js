/* @flow */

import MemoryFileSystem from 'memory-fs'

const fs = new MemoryFileSystem()

export const reset = () => {
  fs.data = {}
}

export const stat = jest.fn().mockImplementation((...args) => {
  fs.stat(...args)
})

export const readdir = jest.fn().mockImplementation((...args) => {
  fs.readdir(...args)
})

export const rmdir = jest.fn().mockImplementation((...args) => {
  fs.rmdir(...args)
})

export const unlink = jest.fn().mockImplementation((...args) => {
  fs.unlink(...args)
})

export const readlink = jest.fn().mockImplementation((...args) => {
  fs.readlink(...args)
})

export const mkdir = jest.fn().mockImplementation((...args) => {
  fs.mkdir(...args)
})

export const readFile = jest.fn().mockImplementation((...args) => {
  fs.readFile(...args)
})

export const exists = jest.fn().mockImplementation((...args) => {
  fs.exists(...args)
})

export const writeFile = jest.fn().mockImplementation((...args) => {
  fs.writeFile(...args)
})
