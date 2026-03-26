import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => [l.split('=')[0].trim(), l.split('=').slice(1).join('=').trim()])
);

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const { data, error } = await supabase
  .from('site_content')
  .select('content')
  .eq('id', 1)
  .single();

if (error) { console.error('Okuma hatası:', error.message); process.exit(1); }

const content = data.content;
const old = content.hero?.backgrounds;
console.log('Mevcut backgrounds:', old);

content.hero.backgrounds = ['/bg1.webp', '/bg2.webp', '/bg3.webp'];

const { error: updateError } = await supabase
  .from('site_content')
  .update({ content })
  .eq('id', 1);

if (updateError) { console.error('Güncelleme hatası:', updateError.message); process.exit(1); }
console.log('✓ Supabase hero.backgrounds güncellendi → [/bg1.webp, /bg2.webp, /bg3.webp]');
