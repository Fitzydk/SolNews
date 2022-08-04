import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Paragraph from '@editorjs/paragraph'
import List from '@editorjs/list'
import Warning from '@editorjs/warning'
import Code from '@editorjs/code'
import LinkTool from '@editorjs/link'
import Image from '@editorjs/image'
import Raw from '@editorjs/raw'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import SimpleImage from '@editorjs/simple-image'
import { StyleInlineTool } from 'editorjs-style';
import Tooltip from 'editorjs-tooltip';

export const EDITOR_JS_TOOLS = {
  // NOTE: Paragraph is default tool. Declare only when you want to change paragraph option.
  //paragraph: Paragraph,
  embed: Embed,
  table: Table,
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: 'unordered'
    }
  },
  warning: Warning,
  code: Code,
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: 'http://localhost:3000/api/fetchURL', // Your backend endpoint for url data fetching
    }
  },
  image: {
    class: Image,
    config: {
      uploader: {
        // basic file upload preview
        uploadByFile: async (file) => { // async because it expects a promise
          console.log(file)
          const url = window.URL.createObjectURL(file) // generate a blob in memory
  
          return {
            success: 1,
            file: {
              url,
              name: file.name,
              size: file.size,
              source: file // keep a reference to the original file
            }
          }
        }
    },
    endpoints: {
      byUrl: 'http://localhost:3000/api/fetchURL'
    }
  }
  },
  raw: Raw,
  header: Header,
  quote: Quote,
  marker: Marker,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  StyleInlineTool: StyleInlineTool,
  Tooltip: Tooltip,
}