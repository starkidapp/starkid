/**
 * DEV-ONLY preview of the Phase 1 design system. Not linked from anywhere.
 * Open it with `router.push('/screens/UiGalleryScreen')` or, on web,
 * http://localhost:8081/screens/UiGalleryScreen
 *
 * Safe to delete once the primitives have been reviewed.
 */
import { useState } from 'react';
import { View } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import {
  AppText,
  Avatar,
  Badge,
  Button,
  Card,
  Dialog,
  EmptyState,
  IconButton,
  ListRow,
  ProgressBar,
  Screen,
  SectionHeader,
  StarBadge,
  TextField,
} from '@/components/ui';
import { spacing } from '@/constants/theme';

export default function UiGalleryScreen() {
  const [text, setText] = useState('');
  const [pwd, setPwd] = useState('');
  const [dialog, setDialog] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title="Design System" />
      <Screen scroll contentContainerStyle={{ gap: spacing.xl, paddingBottom: spacing['4xl'] }}>
        <View style={{ gap: spacing.xs }}>
          <AppText variant="display">Display</AppText>
          <AppText variant="title">Title</AppText>
          <AppText variant="heading">Heading</AppText>
          <AppText variant="subtitle">Subtitle</AppText>
          <AppText variant="body">Body — the quick brown fox jumps over the lazy dog.</AppText>
          <AppText variant="label" color="textMuted">LABEL</AppText>
          <AppText variant="caption" color="textFaint">Caption text</AppText>
        </View>

        <View>
          <SectionHeader title="Buttons" emoji="🎛️" />
          <View style={{ gap: spacing.md }}>
            <Button title="Primary" onPress={() => {}} />
            <Button title="Secondary" variant="secondary" onPress={() => {}} />
            <Button title="Ghost" variant="ghost" onPress={() => {}} />
            <Button title="Subtle" variant="subtle" onPress={() => {}} />
            <Button title="Danger" variant="danger" onPress={() => {}} />
            <Button title="Playful + icon" leftIcon="star" playful onPress={() => {}} />
            <Button title="Loading" loading onPress={() => {}} />
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <Button title="Small" size="sm" onPress={() => {}} />
              <Button title="Large" size="lg" onPress={() => {}} />
            </View>
          </View>
        </View>

        <View>
          <SectionHeader title="Cards" emoji="🃏" />
          <View style={{ gap: spacing.md }}>
            <Card>
              <AppText variant="bodyStrong">Plain card</AppText>
              <AppText variant="caption" color="textMuted">radii.lg · shadows.md</AppText>
            </Card>
            <Card tone="primary" accentBar>
              <AppText variant="bodyStrong">Primary tone + accent bar</AppText>
            </Card>
            <Card tone="star" accentBar>
              <AppText variant="bodyStrong">Star tone</AppText>
            </Card>
          </View>
        </View>

        <View>
          <SectionHeader title="Badges" emoji="🏷️" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            <Badge>Neutral</Badge>
            <Badge tone="primary">Primary</Badge>
            <Badge tone="success">Done</Badge>
            <Badge tone="danger">Penalty</Badge>
            <StarBadge count={12} />
            <StarBadge count={3} signed tone="success" />
            <StarBadge count={-1} tone="danger" />
          </View>
        </View>

        <View>
          <SectionHeader title="Progress" emoji="📊" />
          <View style={{ gap: spacing.md }}>
            <ProgressBar value={2} total={5} label />
            <ProgressBar progress={0.75} color="#06D6A0" />
          </View>
        </View>

        <View>
          <SectionHeader title="Inputs" emoji="⌨️" />
          <TextField
            label="Name"
            placeholder="Enter a name"
            value={text}
            onChangeText={setText}
            leftIcon="person-outline"
          />
          <TextField
            label="Password"
            placeholder="••••••"
            value={pwd}
            onChangeText={setPwd}
            secureToggle
            helper="At least 6 characters"
          />
          <TextField label="With error" placeholder="oops" error="This field is required" />
        </View>

        <View>
          <SectionHeader title="List rows" emoji="📃" />
          <View style={{ gap: spacing.sm }}>
            <ListRow icon="mail-outline" title="Contact Support" subtitle="Get in touch" onPress={() => {}} />
            <ListRow emoji="🔒" iconTone="accent" title="Privacy Policy" subtitle="How we protect your data" onPress={() => {}} />
          </View>
        </View>

        <View>
          <SectionHeader title="Avatars" emoji="🧒" />
          <View style={{ flexDirection: 'row', gap: spacing.lg, alignItems: 'center' }}>
            <Avatar emoji="🧒" size="sm" />
            <Avatar emoji="👧" size="md" selected />
            <Avatar emoji="🦸" size="lg" topRight={<StarBadge count={9} size="sm" />} />
          </View>
        </View>

        <View>
          <SectionHeader title="Icon buttons" emoji="⚡" />
          <View style={{ flexDirection: 'row', gap: spacing.lg }}>
            <IconButton icon="power" variant="danger" onPress={() => {}} />
            <IconButton icon="add" variant="primary" onPress={() => {}} />
            <IconButton icon="settings-outline" variant="surface" onPress={() => {}} />
          </View>
        </View>

        <Button title="Open Dialog" onPress={() => setDialog(true)} />

        <EmptyState
          emoji="🌟"
          title="No stars yet"
          message="Complete a task to earn your first star."
          action={<Button title="Add a task" size="sm" onPress={() => {}} />}
        />

        <Dialog
          visible={dialog}
          onClose={() => setDialog(false)}
          title="End challenge?"
          subtitle="This archives the current challenge and resets everyone to zero."
          actions={[
            { label: 'Cancel', variant: 'ghost', onPress: () => setDialog(false) },
            { label: 'End it', variant: 'danger', onPress: () => setDialog(false) },
          ]}
        />
      </Screen>
    </View>
  );
}
