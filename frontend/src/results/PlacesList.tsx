// Nearby places from the backend's Google Places search (/providers/nearby), used by
// 3.3 Providers and 3.5 Pharmacy. Asks for the phone's location only when shown.
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { api, Place } from '@/api/client';
import { card, colors, fonts } from '@/theme';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';

type State =
  | { status: 'loading' }
  | { status: 'denied' }
  | { status: 'error' }
  | { status: 'done'; places: Place[] };

/** Opens the phone's maps app with a search, e.g. "urgent care near me". */
export function openMapsSearch(query: string) {
  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`);
}

export function PlacesList({ query }: { query: string }) {
  const [state, setState] = useState<State>({ status: 'loading' });

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) return setState({ status: 'denied' });
      const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const places = await api.nearbyProviders(query, coords.latitude, coords.longitude);
      setState({ status: 'done', places });
    } catch {
      // Usually GOOGLE_PLACES_API_KEY isn't set on the backend, or the backend can't be reached
      setState({ status: 'error' });
    }
  }, [query]);

  useEffect(() => {
    load();
  }, [load]);

  const mapsButton = (
    <Button label={`Search “${query}” in Maps`} variant="neutral" icon="search" onPress={() => openMapsSearch(`${query} near me`)} />
  );

  if (state.status === 'loading') {
    return (
      <View style={styles.message}>
        <ActivityIndicator color={colors.brandPrimary} />
        <Text style={styles.messageText}>Finding places near you…</Text>
      </View>
    );
  }
  if (state.status !== 'done' || state.places.length === 0) {
    const text = {
      denied: 'Location is off, so we can’t search near you. You can search in your maps app instead.',
      error: 'We couldn’t load nearby places right now. You can search in your maps app instead.',
      done: 'No places found nearby. Try searching in your maps app.',
    }[state.status];
    return (
      <View style={styles.message}>
        <Text style={styles.messageText}>{text}</Text>
        {mapsButton}
        {state.status !== 'done' && (
          <Pressable onPress={load} hitSlop={8}>
            <Text style={styles.link}>Try again</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {state.places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
      {mapsButton}
    </View>
  );
}

function PlaceCard({ place }: { place: Place }) {
  const name = place.displayName?.text ?? 'Unnamed place';
  const phone = place.nationalPhoneNumber;
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      {place.formattedAddress && <Text style={styles.detail}>{place.formattedAddress}</Text>}
      {place.rating !== undefined && <Text style={styles.detail}>Rating {place.rating.toFixed(1)} / 5</Text>}
      <View style={styles.actions}>
        {phone && (
          <Pressable accessibilityRole="button" style={styles.action} onPress={() => Linking.openURL(`tel:${phone}`)}>
            <Icon name="message" size={16} color={colors.brandPrimary} />
            <Text style={styles.actionText}>Call</Text>
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          style={styles.action}
          onPress={() => openMapsSearch(`${name} ${place.formattedAddress ?? ''}`)}
        >
          <Icon name="chevron-right" size={16} color={colors.brandPrimary} />
          <Text style={styles.actionText}>Directions</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12 },
  message: { gap: 12, alignItems: 'center', paddingVertical: 8 },
  messageText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.textSecondary, textAlign: 'center' },
  link: { fontFamily: fonts.semibold, fontSize: 14, color: colors.brandPrimary },
  card: { ...card, gap: 4 },
  name: { fontFamily: fonts.semibold, fontSize: 16, color: colors.textPrimary },
  detail: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.textSecondary },
  actions: { flexDirection: 'row', gap: 16, marginTop: 8 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.brandPrimary },
});
