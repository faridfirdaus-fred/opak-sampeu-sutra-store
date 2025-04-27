<TableCell className="py-4 text-center">
    <div className="w-48 h-32 relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-sm mx-auto">
        {banner.imageUrl ? (
            <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
            />
        ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <span className="text-slate-400 text-xs">Tidak ada gambar</span>
            </div>
        )}
    </div>
</TableCell>
