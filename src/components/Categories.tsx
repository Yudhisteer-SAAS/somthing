import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Abstract",
    count: 124,
    gradient: "from-primary/80 to-accent/60",
  },
  {
    id: 2,
    name: "Botanical",
    count: 89,
    gradient: "from-emerald-500/80 to-teal-400/60",
  },
  {
    id: 3,
    name: "Travel",
    count: 67,
    gradient: "from-sky-500/80 to-indigo-400/60",
  },
  {
    id: 4,
    name: "Line Art",
    count: 156,
    gradient: "from-rose-400/80 to-pink-400/60",
  },
];

const Categories = () => {
  return (
    <section id="collections" className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blob-shape animate-blob-slow" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 blob-shape animate-blob" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-widest">
            Browse by Style
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Find your vibe
          </h2>
          <p className="text-muted-foreground text-lg">
            Whether you love minimalist designs or bold statements, we've got 
            the perfect collection waiting for you.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <a
              key={category.id}
              href="#"
              className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} transition-transform duration-500 group-hover:scale-110`} />
              
              {/* Overlay pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/20 rounded-full" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                <div>
                  <h3 className="text-2xl font-bold">{category.name}</h3>
                  <p className="text-white/80 mt-1">{category.count} posters</p>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <span className="font-medium">Explore</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
