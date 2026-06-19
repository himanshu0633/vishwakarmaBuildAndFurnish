import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, IconButton, InputBase, Paper, Tooltip, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SearchIcon from '@mui/icons-material/Search';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';

const phone = '919416856468';

const normalize = (value = '') =>
  value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const priceWords = [
  'price',
  'rate',
  'cost',
  'budget',
  'quote',
  'quotation',
  'estimate',
  'kitna',
  'paisa',
  'paise',
  'daam',
  'bhav',
  'charges'
];

const locationWords = [
  'location',
  'address',
  'contact',
  'phone',
  'number',
  'call',
  'shop',
  'office',
  'kaha',
  'kahan',
  'kidhar',
  'map',
  'dadri'
];

const serviceIntentWords = [
  'image',
  'images',
  'photo',
  'photos',
  'pic',
  'picture',
  'design',
  'designs',
  'gallery',
  'latest',
  'dekh',
  'dekho',
  'dikh',
  'dikhao',
  'sample',
  'model'
];

const serviceAliasGroups = [
  {
    targetKeywords: ['ply board door', 'ply-board-door', 'plyboard door'],
    weight: 80,
    aliases: [
      'ply door',
      'plydoor',
      'ply dor',
      'plywood door',
      'plyboard door',
      'flush door',
      'laminate door',
      'designer door',
      'interior door',
      'modular door',
      'panel door',
      'veneer door',
      'pvc coated door',
      'decorative door',
      'engineered wood door',
      'readymade door',
      'bedroom door',
      'office door',
      'plywood darwaza',
      'wooden darwaza',
      'flush darwaz',
      'laminate darwaza',
      'designer darwaza'
    ]
  },
  {
    targetKeywords: ['wooden doors', 'wooden-doors', 'door'],
    weight: 70,
    aliases: [
      'darwaza',
      'darwaja',
      'darvaza',
      'darvaja',
      'drwaza',
      'drwaja',
      'darwaaza',
      'darwaaja',
      'darwaze',
      'darwaaze',
      'dervaza',
      'derwaza',
      'darwza',
      'darvza',
      'gate',
      'main door',
      'entrance',
      'entry gate',
      'wooden door',
      'door'
    ]
  },
  {
    targetKeywords: ['wooden windows', 'wooden-windows', 'window'],
    weight: 70,
    aliases: [
      'khidki',
      'khirki',
      'khidkee',
      'khidkey',
      'khirkee',
      'khirkey',
      'khidkii',
      'khidqi',
      'khidky',
      'khidkie',
      'khirkii',
      'khidkiya',
      'window',
      'windows'
    ]
  },
  {
    targetKeywords: ['modular kitchen', 'modular-kitchen', 'kitchen'],
    weight: 70,
    aliases: [
      'modular kitchen',
      'modern kitchen',
      'smart kitchen',
      'designer kitchen',
      'luxury kitchen',
      'premium kitchen',
      'fitted kitchen',
      'customized kitchen',
      'contemporary kitchen',
      'interior kitchen',
      'kitchen setup',
      'kitchen design',
      'kitchen solution',
      'kitchen studio',
      'kitchen decor',
      'wooden kitchen',
      'pvc kitchen',
      'acrylic kitchen',
      'aluminium kitchen',
      'italian kitchen',
      'moduler kitchen',
      'modlar kitchen',
      'modular kichen',
      'modern rasoi',
      'smart rasoi',
      'kitchen wala setup',
      'designer rasoi',
      'rasoi'
    ]
  },
  {
    targetKeywords: ['wardrobe', 'custom wardrobe', 'sliding wardrobe'],
    weight: 70,
    aliases: [
      'wardrobe',
      'wardrob',
      'wardrope',
      'wadrobe',
      'wardrobe cabinet',
      'closet',
      'cupboard',
      'almirah',
      'almari',
      'sliding wardrobe',
      'modular wardrobe',
      'designer wardrobe',
      'wooden wardrobe',
      'luxury wardrobe',
      'smart wardrobe',
      'storage cabinet',
      'dressing wardrobe',
      'almeera',
      'almira',
      'kapdo ki almari'
    ]
  },
  {
    targetKeywords: ['tv unit', 'tv-unit', 'tv panel'],
    weight: 70,
    aliases: [
      'tv unit',
      'tv unitt',
      'tv cabinet',
      'tv cabnit',
      'tv panel',
      'tv panal',
      'entertainment unit',
      'tv stand',
      'tv standd',
      'tv console',
      'wall unit',
      'media unit',
      'entertainment console',
      'tv wall panel',
      'designer tv unit',
      'modular tv unit',
      'wooden tv unit',
      'led panel',
      'led panal',
      'led unit',
      'wall mounted tv unit',
      'modern tv unit',
      'luxury tv unit',
      'tv wall',
      'tv setup'
    ]
  },
  {
    targetKeywords: ['dressing mirror', 'mirror', 'glass work', 'glass'],
    weight: 65,
    aliases: [
      'mirror',
      'sheesha',
      'shesha',
      'shisha',
      'sheesa',
      'glass mirror',
      'looking mirror',
      'dressing mirror',
      'wall mirror',
      'vanity mirror',
      'decorative mirror',
      'designer mirror',
      'full length mirror',
      'bathroom mirror',
      'modern mirror',
      'led mirror',
      'frameless mirror',
      'wall glass',
      'reflective glass',
      'miror',
      'mirorr',
      'morror',
      'glass'
    ]
  },
  {
    targetKeywords: ['hydraulic bed'],
    weight: 80,
    aliases: ['hydraulic bed', 'storage bed', 'box bed']
  },
  {
    targetKeywords: ['double bed', 'bed'],
    weight: 70,
    aliases: [
      'bed',
      'bedd',
      'beed',
      'wooden bed',
      'wooden bedd',
      'double bed',
      'double bedd',
      'single bed',
      'king size bed',
      'queen size bed',
      'designer bed',
      'luxury bed',
      'modern bed',
      'sofa cum bed',
      'bunk bed',
      'kids bed',
      'cot',
      'bedroom set',
      'platform bed',
      'upholstered bed',
      'bed set',
      'palang',
      'khat',
      'beddroom bed'
    ]
  },
  {
    targetKeywords: ['house construction', 'complete house construction', 'construction'],
    weight: 70,
    aliases: [
      'house construction',
      'home construction',
      'building construction',
      'civil construction',
      'residential construction',
      'turnkey construction',
      'dream home construction',
      'home building',
      'property construction',
      'construction work',
      'building solutions',
      'home development',
      'structure work',
      'interior construction',
      'architecture construction',
      'house constraction',
      'home constraction',
      'ghar banana',
      'makaan construction',
      'building work',
      'civil work',
      'ghar ka kaam'
    ]
  },
  {
    targetKeywords: ['electrical work', 'electrical', 'electric'],
    weight: 70,
    aliases: [
      'electrical work',
      'electric work',
      'electrical services',
      'electrical installation',
      'wiring work',
      'house wiring',
      'commercial wiring',
      'industrial electrical work',
      'power solutions',
      'electrical maintenance',
      'electric fitting',
      'switch board work',
      'lighting work',
      'cctv electrical work',
      'smart electrical solutions',
      'electical work',
      'bijli ka kaam',
      'wiring fitting',
      'light fitting',
      'board fitting'
    ]
  },
  {
    targetKeywords: ['paint work', 'paint', 'painting'],
    weight: 70,
    aliases: [
      'paint work',
      'painting work',
      'wall painting',
      'interior painting',
      'exterior painting',
      'texture paint',
      'wall finish',
      'decorative paint',
      'home painting',
      'building painting',
      'spray painting',
      'designer paint work',
      'waterproof paint work',
      'putty paint work',
      'color coating',
      'premium paint finish',
      'paint work',
      'painting service',
      'color finishing',
      'color work',
      'wall color',
      'paintig work',
      'painter work'
    ]
  },
  {
    targetKeywords: ['plumbing', 'plumbing work', 'plumber'],
    weight: 70,
    aliases: [
      'plumbing',
      'plumbing work',
      'plumbing services',
      'pipe fitting',
      'water pipeline work',
      'sanitary work',
      'bathroom fitting',
      'water connection work',
      'drainage work',
      'pipe installation',
      'water system setup',
      'bathroom plumbing',
      'kitchen plumbing',
      'plumbing maintenance',
      'plumbing solutions',
      'plumber work',
      'paani ki line ka kaam',
      'nal ka kaam',
      'pipe work'
    ]
  },
  {
    targetKeywords: ['tiles work', 'tiles', 'marble work', 'marble'],
    weight: 70,
    aliases: [
      'tiles work',
      'tile work',
      'tile installation',
      'marble installation',
      'floor tiles',
      'floor tile work',
      'wall tiles',
      'wall tile work',
      'bathroom tiles',
      'kitchen tiles',
      'marble work',
      'marble fitting',
      'marble flooring',
      'italian marble work',
      'granite work',
      'stone work',
      'designer flooring',
      'flooring work',
      'luxury flooring',
      'wall cladding work',
      'stone flooring',
      'tile fitting',
      'tiles fitting',
      'tiles ka kaam',
      'marble ka kaam',
      'floor ka kaam',
      'farsh ka kaam',
      'pathar work',
      'tailes work',
      'marbal work',
      'flooring ka kaam'
    ]
  }
];

const getSpeechRecognition = () => {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

const matchesPhrase = (text, phrase) => {
  const normalizedText = ` ${normalize(text)} `;
  const normalizedPhrase = normalize(phrase);
  return Boolean(normalizedPhrase) && normalizedText.includes(` ${normalizedPhrase} `);
};

const getAliasScore = (query, service) => {
  const serviceText = normalize([
    service.name,
    service.slug,
    service.shortDescription,
    service.fullDescription,
    ...(service.tags || [])
  ].join(' '));

  return serviceAliasGroups.reduce((score, group) => {
    const serviceMatchesGroup = group.targetKeywords.some((keyword) => serviceText.includes(normalize(keyword)));
    const queryMatchesAlias = group.aliases.some((alias) => matchesPhrase(query, alias));

    return serviceMatchesGroup && queryMatchesAlias ? score + group.weight : score;
  }, 0);
};

const getServiceScore = (query, service) => {
  const haystack = normalize([
    service.name,
    service.slug,
    service.shortDescription,
    service.fullDescription,
    ...(service.tags || [])
  ].join(' '));
  const queryWords = normalize(query).split(' ').filter((word) => word.length > 1);

  if (!haystack || !queryWords.length) return 0;

  const wordScore = queryWords.reduce((score, word) => {
    if (haystack === word) return score + 10;
    if (haystack.includes(word)) return score + (word.length > 3 ? 4 : 2);
    return score;
  }, 0);

  return wordScore + getAliasScore(query, service);
};

const openWhatsApp = (query) => {
  const message = `Hello Vishwakarma Build & Furnish, I want to discuss this requirement with your experts: ${query}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
};

const SmartServiceSearch = () => {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const [query, setQuery] = useState('');
  const [services, setServices] = useState([]);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');

  const recognitionAvailable = Boolean(getSpeechRecognition());

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get('/services');
        setServices(response.data.success ? response.data.data || [] : []);
      } catch (error) {
        console.error('Error fetching services for smart search:', error);
      }
    };

    fetchServices();
  }, []);

  const suggestions = useMemo(
    () => services.slice(0, 4).map((service) => service.name).filter(Boolean),
    [services]
  );

  const handleSearch = (searchText = query) => {
    const cleanQuery = searchText.trim();
    const normalizedQuery = normalize(cleanQuery);

    if (!cleanQuery) return;

    const hasPriceIntent = priceWords.some((word) => normalizedQuery.includes(word));
    if (hasPriceIntent) {
      openWhatsApp(cleanQuery);
      return;
    }

    const bestService = services
      .map((service) => ({ service, score: getServiceScore(cleanQuery, service) }))
      .sort((first, second) => second.score - first.score)[0];
    const hasServiceIntent = serviceIntentWords.some((word) => normalizedQuery.includes(word));

    if (bestService?.score > 0 && (hasServiceIntent || bestService.score >= 4)) {
      navigate(`/services/${bestService.service.slug}`);
      return;
    }

    const hasLocationIntent = locationWords.some((word) => normalizedQuery.includes(word));
    if (hasLocationIntent) {
      navigate('/contact');
      return;
    }

    if (bestService?.score > 0) {
      navigate(`/services/${bestService.service.slug}`);
      return;
    }

    openWhatsApp(cleanQuery);
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      setVoiceError('Voice search is not supported in this browser.');
      return;
    }

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceError('');
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      setQuery(transcript);
      handleSearch(transcript);
    };

    recognition.onerror = () => {
      setVoiceError('Please allow microphone permission and try again.');
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 860, mx: 'auto', mb: { xs: 3, md: 4 } }}>
      <Paper
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          handleSearch();
        }}
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.5, sm: 1 },
          p: { xs: 0.7, sm: 0.9 },
          borderRadius: 2,
          bgcolor: 'rgba(248,250,252,0.96)',
          border: '1px solid rgba(212,175,55,0.42)',
          boxShadow: '0 18px 44px rgba(0,0,0,0.26)'
        }}
      >
        <SearchIcon sx={{ color: '#6B7280', ml: { xs: 0.8, sm: 1.2 }, flex: '0 0 auto' }} />
        <InputBase
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search or speak: wooden door images, latest kitchen design, price, location..."
          sx={{
            flex: 1,
            color: '#111827',
            fontWeight: 700,
            fontSize: { xs: '0.82rem', sm: '0.96rem', md: '1.05rem' },
            minWidth: 0,
            '& input::placeholder': {
              color: '#6B7280',
              opacity: 1
            }
          }}
          inputProps={{ 'aria-label': 'Search services by text or voice' }}
        />
        <Tooltip title={recognitionAvailable ? 'Speak your requirement' : 'Voice search not supported'}>
          <span>
            <IconButton
              type="button"
              onClick={handleVoiceSearch}
              disabled={!recognitionAvailable}
              sx={{
                bgcolor: listening ? '#25D366' : 'rgba(17,24,39,0.08)',
                color: listening ? '#07130B' : '#111827',
                '&:hover': { bgcolor: listening ? '#1EBE5D' : 'rgba(212,175,55,0.2)' }
              }}
            >
              {listening ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          </span>
        </Tooltip>
        <Button
          type="submit"
          variant="contained"
          endIcon={<WhatsAppIcon sx={{ display: { xs: 'none', sm: 'inline-flex' } }} />}
          sx={{
            bgcolor: '#D4AF37',
            color: '#111827',
            fontWeight: 900,
            textTransform: 'none',
            minWidth: { xs: 76, sm: 112 },
            px: { xs: 1.2, sm: 2.2 },
            '&:hover': { bgcolor: '#B88917' }
          }}
        >
          Search
        </Button>
      </Paper>

      <Box sx={{ display: 'flex', gap: 1, mt: 1.3, justifyContent: 'center', flexWrap: 'wrap' }}>
        {suggestions.map((name) => (
          <Button
            key={name}
            size="small"
            onClick={() => {
              const text = `${name} images`;
              setQuery(text);
              handleSearch(text);
            }}
            sx={{
              color: '#F8FAFC',
              borderColor: 'rgba(212,175,55,0.45)',
              bgcolor: 'rgba(248,250,252,0.08)',
              fontWeight: 800,
              textTransform: 'none',
              fontSize: { xs: '0.72rem', sm: '0.8rem' },
              maxWidth: '100%',
              whiteSpace: 'normal'
            }}
            variant="outlined"
          >
            {name} images
          </Button>
        ))}
      </Box>

      {!!voiceError && (
        <Typography sx={{ color: '#FCA5A5', fontSize: '0.82rem', mt: 1, textAlign: 'center', fontWeight: 700 }}>
          {voiceError}
        </Typography>
      )}
    </Box>
  );
};

export default SmartServiceSearch;
