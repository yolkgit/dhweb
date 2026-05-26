$filePath = Join-Path $PSScriptRoot "..\pages\Admin.tsx"
$bytes = [System.IO.File]::ReadAllBytes($filePath)
$content = [System.Text.Encoding]::UTF8.GetString($bytes)

# Find the VIDEOS tab section
$startIdx = $content.IndexOf("activeTab === 'VIDEOS'")
if ($startIdx -eq -1) {
    Write-Host "ERROR: Could not find VIDEOS tab marker"
    exit 1
}
Write-Host "Found VIDEOS tab at index: $startIdx"

# Go back to the opening of the JSX block
$lineStart = $content.LastIndexOf("`n", $startIdx) + 1
Write-Host "Line starts at: $lineStart"

# Find the matching closing parenthesis using simple counter
$braceCount = 0
$endIdx = -1
$foundFirst = $false

for ($i = $lineStart; $i -lt $content.Length; $i++) {
    $ch = $content[$i]
    if ($ch -eq '(') { 
        $braceCount++
        $foundFirst = $true
    }
    if ($ch -eq ')') { 
        $braceCount--
        if ($foundFirst -and $braceCount -eq 0) {
            # Find end of this line
            $nextNewline = $content.IndexOf("`n", $i)
            if ($nextNewline -gt 0) {
                $endIdx = $nextNewline + 1
            } else {
                $endIdx = $i + 1
            }
            break
        }
    }
}

if ($endIdx -eq -1) {
    Write-Host "ERROR: Could not find end of VIDEOS tab"
    exit 1
}

Write-Host "Section: chars $lineStart to $endIdx (length: $($endIdx - $lineStart))"
Write-Host "Preview of section start: $($content.Substring($lineStart, [Math]::Min(80, $endIdx - $lineStart)))"

$newSection = @'
             {activeTab === 'VIDEOS' && (
                <div className="animate-fade-in-up">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">영상 및 슬라이드 관리</h2>
                  <p className="text-sm text-slate-500 mb-6">카테고리별 YouTube 영상 링크를 연결하거나, 영상이 없는 경우 <span className="text-emerald-600 font-medium">사진 슬라이드</span>를 업로드할 수 있습니다.</p>
                  
                  {/* API Key Setting */}
                  <div className="bg-slate-800 text-white p-6 rounded-xl mb-8 shadow-lg">
                     <div className="flex items-start gap-4">
                        <div className="bg-emerald-500/20 p-3 rounded-lg text-emerald-400 shrink-0">
                           <Key size={24} />
                        </div>
                        <div className="flex-1">
                           <h3 className="text-lg font-bold mb-1">YouTube Data API Key 설정</h3>
                           <p className="text-slate-300 text-sm mb-4">
                             재생목록을 안정적으로 불러오기 위해 Google Cloud Console에서 발급받은 API Key를 입력해주세요. <br/>
                             키가 없으면 불안정한 RSS 방식(백업)으로 작동하여 오류가 발생할 수 있습니다.
                           </p>
                           <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={appSettings.youtubeApiKey}
                                onChange={(e) => updateAppSettings({...appSettings, youtubeApiKey: e.target.value})}
                                placeholder="AIzaSy..."
                                className="flex-1 bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono"
                              />
                           </div>
                        </div>
                     </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-4">카테고리별 영상/슬라이드 설정</h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {categories.map((category) => {
                      const hasPlaylist = !!(playlists[category.id] && playlists[category.id].trim());
                      const slideImages = category.slideImages || [];
                      return (
                      <div key={category.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                         <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b border-slate-200">
                            <div className="bg-emerald-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">
                              {category.label.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-lg">{category.label}</h4>
                              <p className="text-xs text-slate-400">ID: {category.id}</p>
                            </div>
                            {hasPlaylist ? (
                              <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                <Youtube size={12} /> 영상 연결됨
                              </span>
                            ) : slideImages.length > 0 ? (
                              <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                <ImageIcon size={12} /> 사진 {slideImages.length}장
                              </span>
                            ) : (
                              <span className="ml-auto text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold">
                                미설정
                              </span>
                            )}
                         </div>
                         
                         <div className="p-6 space-y-6">
                           {/* YouTube Link */}
                           <div>
                              <label className="label flex items-center gap-2">
                                <Youtube size={16} className="text-red-500" /> YouTube 링크 (Playlist or Video URL)
                              </label>
                              <input 
                                type="text" 
                                className="input-field" 
                                placeholder="예: https://www.youtube.com/playlist?list=... 또는 https://youtu.be/..."
                                value={playlists[category.id] || ''}
                                onChange={(e) => handlePlaylistChange(category.id, e.target.value)}
                              />
                              {playlists[category.id] && (
                                <p className="text-xs text-emerald-600 mt-2 flex items-center">
                                  <Info size={12} className="mr-1" /> 
                                  ID 감지됨: {playlists[category.id]} 
                                  {playlists[category.id].startsWith('PL') || playlists[category.id].startsWith('UU') ? ' (재생목록)' : ' (개별 동영상)'}
                                </p>
                              )}
                           </div>

                           {/* Photo Slideshow - shown when no playlist */}
                           {!hasPlaylist && (
                             <div className="border-t border-slate-200 pt-6">
                               <div className="flex items-center justify-between mb-3">
                                 <label className="label mb-0 flex items-center gap-2">
                                   <ImageIcon size={16} className="text-emerald-600" /> 사진 슬라이드 (영상 미등록 시 표시)
                                 </label>
                               </div>
                               <p className="text-xs text-slate-500 mb-4">YouTube 영상 링크가 없으면 아래 업로드한 사진이 메인페이지에서 슬라이드로 표시됩니다.</p>

                               {/* Uploaded Images Grid */}
                               {slideImages.length > 0 && (
                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                   {slideImages.map((imgUrl: string, imgIdx: number) => (
                                     <div key={imgIdx} className="relative group aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                       <img src={imgUrl} alt={`슬라이드 ${imgIdx + 1}`} className="w-full h-full object-cover" />
                                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                         <button 
                                           onClick={() => {
                                             const newImages = slideImages.filter((_: string, i: number) => i !== imgIdx);
                                             updateCategory({ ...category, slideImages: newImages });
                                           }}
                                           className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700"
                                           title="삭제"
                                         >
                                           <Trash2 size={14} />
                                         </button>
                                       </div>
                                       <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                                         {imgIdx + 1}
                                       </div>
                                     </div>
                                   ))}
                                 </div>
                               )}

                               {/* Add Image Button */}
                               <ImageInput 
                                 label="슬라이드 사진 추가" 
                                 value="" 
                                 onChange={(url) => {
                                   if (url) {
                                     const newImages = [...slideImages, url];
                                     updateCategory({ ...category, slideImages: newImages });
                                   }
                                 }} 
                               />
                             </div>
                           )}
                         </div>
                      </div>
                    );
                    })}
                  </div>
                  
                  <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-sm">
                    <span className="font-bold">✨ 자동 저장됨:</span> 입력하는 즉시 웹사이트에 반영됩니다.
                  </div>
               </div>
              )}
'@

$before = $content.Substring(0, $lineStart)
$after = $content.Substring($endIdx)
$newContent = $before + $newSection + "`r`n" + $after

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllBytes($filePath, $utf8NoBom.GetBytes($newContent))
Write-Host "SUCCESS: VIDEOS tab replaced. New file size: $($newContent.Length) chars"
