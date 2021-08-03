import fs from "fs"
import path from "path"
import matter from "gray-matter"
import remark from "remark"
import html from "remark-html"

const postsDirectory = path.join(process.cwd(), "posts")//絶対パスを作っているprocess.cwd=pwdにpostをくっつけている

export const getSortedPostsData = () => {
   const fileNames = fs.readdirSync(postsDirectory); //Get file names under /posts
  const allpostsData = fileNames.map((fileNames) => {
    const id = fileNames.replace(/\.md$/, ''); //idを得るために.mdを削除する
  

    const fullPath = path.join(postsDirectory, fileNames);//マークダウンを文字列型として読む
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents)
    //idとデータをくっつける
    return {
      id, ...matterResult.data
    }
  })

  //先ほどのデータを日付順にソートする
  return allpostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
    return 1
    } else if (a > b) {
      return -1
    } else {
      return 0
  }
})
}

export const getAllPostIds=()=>{
  const fileName = fs.readdirSync(postsDirectory)
  
  return fileName.map(fileName => {
    return {
      params: {
        id:fileName.replace(/\.md$/,"")
      }
    }
  })
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, "utf-8")
  
  const matterResult = matter(fileContents)
  
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()
  
  return {
    id, contentHtml,
    ...matterResult.data
  }
}