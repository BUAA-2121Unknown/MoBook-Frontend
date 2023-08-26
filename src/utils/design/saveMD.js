export const saveMD = (md,name)=>{
    const a = document.createElement('a');
    a.href = `data:text/plain;charset=utf-8,${encodeURIComponent(md)}`;
    a.download = `${name}.md`;
    a.click();
    return true;
}