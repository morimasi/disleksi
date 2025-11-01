import React, { useState, useMemo } from 'react';
import { styles } from '../styles';
import { MODULE_DATA } from '../data/modules';

export const SavedActivitiesList = ({ activities, onView, onDelete }) => {
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredActivities = useMemo(() => {
        return activities
            .filter(act => filterCategory === 'all' || act.categoryKey === filterCategory)
            .filter(act => act.module.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [activities, filterCategory, searchTerm]);

    const filterButtons = [
        { key: 'all', label: 'Tümü' },
        { key: 'dyslexia', label: 'Disleksi' },
        { key: 'dyscalculia', label: 'Diskalkuli' },
        { key: 'dysgraphia', label: 'Disgrafi' }
    ];

    return (
        <div style={styles.fullPageWrapper}>
            <h2 style={styles.pageTitle}>Kaydedilen Etkinlikler</h2>

            {/* We can add filtering/searching back later if needed */}

            {activities.length === 0 ? (
                <p style={styles.placeholder}>Henüz kaydedilmiş bir etkinlik yok.</p>
            ) : filteredActivities.length === 0 ? (
                <p style={styles.placeholder}>Eşleşen etkinlik bulunamadı.</p>
            ) : (
                <div style={styles.savedList}>
                    {filteredActivities.map(activity => {
                        const category = MODULE_DATA[activity.categoryKey];
                        if (!category) return null; // Handle case where category might not exist
                        return (
                            <div key={activity.id} style={styles.savedItem}>
                                <div style={styles.savedItemInfo} onClick={() => onView(activity)} role="button" tabIndex={0} aria-label={`${activity.module} etkinliğini görüntüle`}>
                                    <span style={{...styles.savedItemIcon, backgroundColor: category.color}}>{category.icon}</span>
                                    <div>
                                        <h3 style={styles.savedItemTitle}>{activity.module}</h3>
                                        <p style={styles.savedItemModule}>{category.title} - {activity.content.length} sayfa</p>
                                    </div>
                                </div>
                                <button onClick={() => onDelete(activity.id)} style={styles.deleteButton} aria-label={`${activity.module} etkinliğini sil`}>Sil</button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};