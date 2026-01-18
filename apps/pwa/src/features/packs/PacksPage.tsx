import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/app/providers';
import { PackCard } from '@/ui/components';
import { getAllPacks, togglePack, initializePrompts } from '@/data';
import type { Pack } from '@/domain';

export default function PacksPage() {
  const locale = useSettingsStore((s) => s.locale);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);

  // Load packs on mount
  useEffect(() => {
    async function loadPacks() {
      await initializePrompts();
      const allPacks = await getAllPacks();
      setPacks(allPacks);
      setLoading(false);
    }
    loadPacks();
  }, []);

  const handleToggle = async (packId: string, enabled: boolean) => {
    await togglePack(packId, enabled);
    setPacks((prev) =>
      prev.map((p) => (p.id === packId ? { ...p, isEnabled: enabled } : p))
    );
  };

  // Calculate totals
  const enabledPacks = packs.filter((p) => p.isEnabled);
  const totalPrompts = enabledPacks.reduce((sum, p) => sum + p.prompts.length, 0);
  const totalTruths = enabledPacks.reduce(
    (sum, p) => sum + p.prompts.filter((pr) => pr.type === 'truth').length,
    0
  );
  const totalDares = enabledPacks.reduce(
    (sum, p) => sum + p.prompts.filter((pr) => pr.type === 'dare').length,
    0
  );

  return (
    <div className="flex-1 flex flex-col p-4 gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="glass glass-hover w-10 h-10 flex items-center justify-center rounded-full"
          aria-label={locale === 'tr' ? 'Geri' : 'Back'}
        >
          <span className="text-xl">&larr;</span>
        </Link>
        <h1 className="text-2xl font-bold">
          {locale === 'tr' ? 'Paketler' : 'Packs'}
        </h1>
      </div>

      {/* Stats banner */}
      {!loading && (
        <div className="glass rounded-[var(--radius-lg)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">
                {locale === 'tr' ? 'Aktif Sorular' : 'Active Prompts'}
              </p>
              <p className="text-2xl font-bold">{totalPrompts}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xl font-semibold text-blue-400">{totalTruths}</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {locale === 'tr' ? 'Doğruluk' : 'Truth'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-orange-400">{totalDares}</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {locale === 'tr' ? 'Cesaret' : 'Dare'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Packs list */}
      {!loading && (
        <section className="flex-1">
          <h2 className="text-lg font-semibold mb-3 text-[var(--color-text-muted)]">
            {locale === 'tr' ? 'Mevcut Paketler' : 'Available Packs'}
          </h2>
          <div className="space-y-3">
            {packs.map((pack) => (
              <PackCard
                key={pack.id}
                pack={pack}
                locale={locale}
                onToggle={(enabled) => handleToggle(pack.id, enabled)}
              />
            ))}
          </div>

          {packs.length === 0 && (
            <div className="text-center py-8 text-[var(--color-text-muted)]">
              <p>{locale === 'tr' ? 'Paket bulunamadı' : 'No packs found'}</p>
            </div>
          )}
        </section>
      )}

      {/* Info note */}
      {!loading && (
        <p className="text-xs text-center text-[var(--color-text-muted)]">
          {locale === 'tr'
            ? 'Aktif paketlerden oyunda rastgele sorular seçilecek'
            : 'Random prompts from enabled packs will be used in game'}
        </p>
      )}
    </div>
  );
}
