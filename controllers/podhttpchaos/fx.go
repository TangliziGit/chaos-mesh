// Copyright 2021 Chaos Mesh Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// See the License for the specific language governing permissions and
// limitations under the License.

package podhttpchaos

import (
	"reflect"

	"github.com/go-logr/logr"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/event"
	"sigs.k8s.io/controller-runtime/pkg/predicate"

	"github.com/chaos-mesh/chaos-mesh/api/v1alpha1"
	"github.com/chaos-mesh/chaos-mesh/controllers/config"
	"github.com/chaos-mesh/chaos-mesh/controllers/utils/builder"
	"github.com/chaos-mesh/chaos-mesh/controllers/utils/chaosdaemon"
)

func Bootstrap(mgr ctrl.Manager, client client.Client, logger logr.Logger, b *chaosdaemon.ChaosDaemonClientBuilder) error {
	if !config.ShouldSpawnController("podhttpchaos") {
		return nil
	}

	return builder.Default(mgr).
		For(&v1alpha1.PodHttpChaos{}).
		Named("podhttpchaos").
		WithEventFilter(predicate.Funcs{
			UpdateFunc: func(e event.UpdateEvent) bool {
				oldObj := e.ObjectOld.(*v1alpha1.PodHttpChaos)
				newObj := e.ObjectNew.(*v1alpha1.PodHttpChaos)

				return !reflect.DeepEqual(oldObj.Spec, newObj.Spec)
			},
		}).
		Complete(&Reconciler{
			Client:                   client,
			Log:                      logger.WithName("podhttpchaos"),
			Recorder:                 mgr.GetEventRecorderFor("podhttpchaos"),
			ChaosDaemonClientBuilder: b,
		})
}
