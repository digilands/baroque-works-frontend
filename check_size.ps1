Add-Type -AssemblyName System.Drawing
$files = Get-ChildItem "c:\Users\ishaq\Desktop\Baroque_works\Screenshot*.png" | Sort-Object Name
foreach ($f in $files) {
    try {
        $img = [System.Drawing.Image]::FromFile($f.FullName)
        Write-Host "$($f.Name): $($img.Width)x$($img.Height) (Size: $($f.Length))"
        $img.Dispose()
    } catch {
        Write-Host "Error reading $($f.Name)"
    }
}
