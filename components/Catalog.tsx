import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';
import { GeminiService } from '../services/geminiService';

interface CatalogProps {
  geminiService: GeminiService | null;
}

const Catalog: React.FC<CatalogProps> = ({ geminiService }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [generatingSku, setGeneratingSku] = useState<string | null>(null);

  const handleVisualize = async (product: Product) => {
    if (!geminiService || generatingSku) return;
    
    setGeneratingSku(product.sku);
    const newImage = await geminiService.generateProductImage(product);
    setGeneratingSku(null);

    if (newImage) {
        setProducts(prev => prev.map(p => 
            p.sku === product.sku ? { ...p, generatedImage: newImage } : p
        ));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950 scrollbar-hide">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 font-sans tracking-tight">
                Digital Collection
            </h2>
            <p className="text-slate-500 text-sm mt-1">FW24 / VIRTUAL SHOWROOM</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.sku} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 group">
            <div className="relative aspect-square overflow-hidden bg-slate-800">
                {/* Image or Generator */}
                <img 
                    src={product.generatedImage || product.images[0]} 
                    alt={product.name} 
                    className={`w-full h-full object-cover transition-all duration-700 ${generatingSku === product.sku ? 'opacity-50 blur-sm scale-110' : 'opacity-90 group-hover:opacity-100 group-hover:scale-105'}`} 
                />
                
                {/* Generation Overlay */}
                {generatingSku === product.sku && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-cyan-500/50">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                            <span className="text-xs font-mono text-cyan-400">AI RENDERING...</span>
                        </div>
                    </div>
                )}

                {/* Tags */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {product.tags.filter(t => t.includes('promo')).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-fuchsia-600/90 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider rounded-sm">
                            {tag.split(':')[1]}
                        </span>
                    ))}
                </div>

                <div className="absolute bottom-3 right-3">
                    <button 
                        onClick={() => handleVisualize(product)}
                        disabled={!!generatingSku}
                        className="flex items-center gap-2 bg-slate-950/80 hover:bg-cyan-500 hover:text-black backdrop-blur-md text-cyan-400 text-xs font-bold px-3 py-1.5 rounded-full border border-cyan-500/30 transition-all active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        AI VISUALIZE
                    </button>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">{product.category}</p>
                        <h3 className="text-lg font-bold text-white mt-1">{product.name}</h3>
                    </div>
                    <span className="text-lg font-mono text-cyan-400">${product.price}</span>
                </div>
                
                <div className="space-y-2 mt-4">
                     {Object.entries(product.attributes).slice(0,2).map(([key, val]) => (
                        <div key={key} className="flex justify-between text-xs border-b border-slate-800 pb-1">
                            <span className="text-slate-500 capitalize">{key}</span>
                            <span className="text-slate-300 capitalize">{Array.isArray(val) ? val.join(', ') : String(val)}</span>
                        </div>
                     ))}
                </div>

                <button className="w-full mt-5 bg-slate-800 hover:bg-white hover:text-black text-white font-medium py-3 rounded-lg text-xs uppercase tracking-widest transition-colors border border-slate-700">
                    Add to Cart
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;